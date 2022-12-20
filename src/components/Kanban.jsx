import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import TaskCreator from "./TaskCreator";
import TasksBoard from "./TasksBoard";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { db, auth } from "./../firebase";

export default function Kanban() {
    const [groups, setGroups] = useState([]);

    //Read from db
    useEffect(() => {
        (async () => {
            try {
                const docSnap = await getDoc(doc(db, "kanbans", auth.currentUser.uid));
                if (docSnap.exists()) {
                    setGroups(JSON.parse(docSnap.data().kanban));
                } else {
                    // Default setup for new users
                    setGroups([
                        {
                            title: "Бэклог",
                            color: "#6A6E6B",
                            tasks: [{ id: nanoid(), content: "Задача" }],
                        },
                        {
                            title: "В процессе",
                            color: "#EB6B50",
                            tasks: [],
                        },
                        {
                            title: "Завершено",
                            color: "#56BB62",
                            tasks: [],
                        },
                        {
                            title: "Корзина",
                            color: "#E62E51",
                            tasks: [],
                            isTrashBin: true,
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error reading a document: ", error);
            }
        })();
    }, []);

    // Write to db
    useEffect(() => {
        if (groups.length > 0) {
            (async () => {
                try {
                    await setDoc(doc(db, "kanbans", auth.currentUser.uid), {
                        kanban: JSON.stringify(groups),
                    });
                    console.log("Document saved");
                } catch (error) {
                    console.error("Error adding a document: ", error);
                }
            })();
        }
    }, [groups]);

    return (
        <div className="container mx-auto">
            <TaskCreator setGroups={setGroups} />
            <TasksBoard groups={groups} setGroups={setGroups} />
        </div>
    );
}
