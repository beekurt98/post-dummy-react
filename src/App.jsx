import { useEffect, useState } from 'react'
import './App.css'
import { likeSvg, dislikeSvg, viewSvg, arrowSvg } from './Svg.jsx'

export default function App() {
  const [postId, setPostId] = useState(1)
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [postSelected, setPostSelected] = useState(false)
  const selectedPost = posts.find(post => post.id === postId);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      const data = await fetch("https://dummyjson.com/posts").then(res => res.json())
      setPosts(data.posts)
    }
    getData();
  }, [])

  useEffect(() => {
    async function getComments() {
      const data = await fetch(`https://dummyjson.com/posts/${postId}/comments`).then(res => res.json())
      setComments(data.comments)
      setLoading(false);
    }
    getComments();
  }, [postId])

  function handleShowPost(id) {
    setPostSelected(true)
    setPostId(id)
  }

  return (
    <>
      <h1>Posts</h1>
      <div className="posts-div">
        {
          postSelected
            ? isLoading ? "Loading..." : <>
              <button className='back-btn' onClick={() => { setPostSelected(!postSelected) }}>back</button>
              <div className='post'>
                <h3>{selectedPost.title}</h3>
                <p>{selectedPost.body}</p>
                <div className='tags-div'>
                  {
                    selectedPost.tags.map((tag) => <button key={crypto.randomUUID()} className='tag-btn'>{tag}</button>)
                  }
                </div>
                <div className="reactions">
                  <p>{likeSvg} {selectedPost.reactions.likes}</p>
                  <p>{dislikeSvg}{selectedPost.reactions.dislikes}</p>
                  <p className='views'>{viewSvg}{selectedPost.views}</p>
                </div>
              </div>
              {
                comments.length != 0
                  ? comments.map((comment) => {
                    return <div
                      className='comment'
                      key={comment.id}>
                        <div className='comment-header'>
                        <span>{arrowSvg}</span><h4>{comment.user.username}</h4>

                        </div>
                      <p>{comment.body}</p>
                      <div className="reactions">
                      <p>{likeSvg}{comment.likes}</p>
                      </div>
                    </div>
                  })
                  : "No comments."
              }
            </>
            : posts.map((post) => {
              return <div className='single-post' onClick={() => handleShowPost(post.id)} key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body.split(" ").slice(0, 20).join(" ") + "..."}</p>
                <div className="tags-div">
                  {
                    post.tags.map((tag) => <button key={crypto.randomUUID()} className='tag-btn'>{tag}</button>)
                  }
                </div>
              </div>
            })
        }
      </div>
    </>
  )
}