export let AllComments = [];

export function addComment(commentObject) {
    AllComments.push(commentObject);
    return AllComments;
}