import { app, auth } from "./index.ts";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  writeBatch,
  startAfter,
  FieldPath,
  getCountFromServer,
  startAt,
  endAt,
} from "firebase/firestore";

const db = getFirestore(app);

export const retrieveDataWithFilter = async (
  object_collection:any,
  filter_object :any = null,
  order_object :any = null,
) => {
  let q = query(collection(db, object_collection));

  if (filter_object != null && order_object != null) {
    q = query(
      collection(db, object_collection),
      where(filter_object.field, filter_object.operator, filter_object.value),
      orderBy(order_object.field, order_object.order)
    );
  } else if (filter_object != null) {
    q = query(
      collection(db, object_collection),
      where(filter_object.field, filter_object.operator, filter_object.value)
    );
  } else if (order_object != null) {
    q = query(
      collection(db, object_collection),
      orderBy(order_object.field, order_object.order)
    );
  }

  return new Promise((resolve, reject) => {
    try {
      getDocs(q)
        .then((data) => {
          const result = [] as any;
          data.forEach((doc) => {
            const res = { ...doc.data() };
            if (!res.id) {
              res.id = doc.id;
            }
            result.push(res);
          });
          resolve(result);
        })
        .catch((error) => {
          alert(error.code);
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};