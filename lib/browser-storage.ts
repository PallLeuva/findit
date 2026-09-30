import type { Photo } from "./findit";

type StoredPhoto = Omit<Photo, "imageUrl" | "sample"> & { image: Blob };
type DraftPhoto = Photo & { blob?: Blob };
const MAX_PHOTOS = 200;
const objectUrls = new Map<string, string>();
let database: Promise<IDBDatabase> | undefined;

function storageError(error: unknown): Error {
  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return new Error("This browser is out of storage. Delete an older photo or free up device space, then try again.");
  }
  return error instanceof Error ? error : new Error("Could not save changes in this browser. Your previous photos are unchanged.");
}

function openDatabase(): Promise<IDBDatabase> {
  if (database) return database;
  database = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Photo storage is unavailable in this browser. Try a regular browser window with site storage enabled."));
      return;
    }
    const request = indexedDB.open("findit-photo-library", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("photos", { keyPath: "id" });
    };
    request.onerror = () => reject(new Error("Could not open your photo library. Check that this browser allows site storage."));
    request.onblocked = () => reject(new Error("Close other FindIt tabs, then retry opening your library."));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); database = undefined; };
      resolve(db);
    };
  }).catch(error => { database = undefined; throw error; });
  return database;
}

async function transaction<T>(
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore, done: (value: T) => void, fail: (error: Error) => void) => void,
): Promise<T> {
  const db = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction("photos", mode);
    let result: T;
    let failure: Error | undefined;
    // A successful individual request is not enough: wait for the commit.
    tx.oncomplete = () => resolve(result);
    tx.onabort = () => reject(failure ?? storageError(tx.error));
    const fail = (error: Error) => { failure = error; tx.abort(); };
    try { work(tx.objectStore("photos"), value => { result = value; }, fail); }
    catch (error) { fail(storageError(error)); }
  });
}

function displayPhoto(row: StoredPhoto): Photo {
  let imageUrl = objectUrls.get(row.id);
  if (!imageUrl) { imageUrl = URL.createObjectURL(row.image); objectUrls.set(row.id, imageUrl); }
  const { image: _image, ...metadata } = row;
  return { ...metadata, imageUrl };
}

export async function listPhotos(): Promise<Photo[]> {
  const rows = await transaction<StoredPhoto[]>("readonly", (store, done) => {
    const request = store.getAll();
    request.onsuccess = () => done(request.result as StoredPhoto[]);
  });
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(displayPhoto);
}

export async function savePhoto(draft: DraftPhoto): Promise<Photo> {
  if (draft.sample) throw new Error("Add your own photo to save a space.");
  if (!draft.location.trim()) throw new Error("Give this photo a location first.");
  if (draft.items.length > 60 || draft.items.some(item => !item.label.trim())) {
    throw new Error("Use up to 60 items, each with a name.");
  }
  if (draft.blob && (draft.blob.type !== "image/jpeg" || draft.blob.size > 5 * 1024 * 1024)) {
    throw new Error("Choose a photo smaller than 5 MB after resizing.");
  }
  const metadata = {
    location: draft.location.trim().slice(0, 100),
    notes: draft.notes.slice(0, 500),
    items: draft.items.map(item => ({ ...item, label: item.label.trim().slice(0, 100) })),
    width: draft.width,
    height: draft.height,
  };
  const saved = await transaction<StoredPhoto>("readwrite", (store, done, fail) => {
    if (draft.blob) {
      const request = store.count();
      request.onsuccess = () => {
        if (request.result >= MAX_PHOTOS) { fail(new Error("Your library holds up to 200 photos. Delete an older photo to add another.")); return; }
        const row: StoredPhoto = { ...metadata, id: crypto.randomUUID(), createdAt: new Date().toISOString(), image: draft.blob! };
        store.add(row);
        done(row);
      };
    } else {
      const request = store.get(draft.id);
      request.onsuccess = () => {
        const previous = request.result as StoredPhoto | undefined;
        if (!previous) { fail(new Error("This photo is no longer saved. Close it and refresh your library.")); return; }
        const row: StoredPhoto = { ...previous, ...metadata };
        store.put(row);
        done(row);
      };
    }
  });
  return displayPhoto(saved);
}

export async function deletePhoto(id: string): Promise<void> {
  await transaction<void>("readwrite", (store, done) => { store.delete(id); done(); });
  const url = objectUrls.get(id);
  if (url) URL.revokeObjectURL(url);
  objectUrls.delete(id);
}

export function releasePhotoUrls(): void {
  for (const url of objectUrls.values()) URL.revokeObjectURL(url);
  objectUrls.clear();
}
