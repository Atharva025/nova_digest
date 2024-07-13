import { useState } from "react";
import "../src/css/Comments.css";
import { AllComments, addComment } from "./components/CommentsAll";

const Comments = () => {

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    function commentClicked() {
        const commentObject = {
            userName: "New User",
            comment: comment,
        };

        // setComments([...comments, commentObject]);
        // setAllComments([...allComments, commentObject]);
        const newComments = addComment(commentObject);
        localStorage.setItem('comments', JSON.stringify(newComments));
        setComments(newComments);
        setComment("");
        console.log(AllComments);
    }

    return (
        <>
            <div className="border-2 w-full rounded-xl">
                <div className="">
                    <div className="flex  justify-center flex-col">
                        <span className="text-center">This is the Comments Section</span>
                        <span id="addAComment">Add a Comment</span>
                        <input className="w-full h-[50px] text-black rounded-2xl border-2 my-2 sm:w-[500px]" placeholder="Type Something!" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                    <button onClick={commentClicked} className="button px-4 py-1">Comment</button>
                </div>

                <span>Comments: </span>

                {comments.map((item, index) => {
                    return (
                        <>
                            <div className="flex flex-col border-2 mb-2" key={index}>
                                <span>{item.userName}</span>
                                <span>{item.comment}</span>
                            </div>
                        </>
                    )
                })}
            </div>
        </>
    )
}

export default Comments