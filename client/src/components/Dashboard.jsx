import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [allposts, setAllPosts] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [postsRes, userRes] = await Promise.all([
        axios.get('http://localhost:8000/api/post', { withCredentials: true }),
        axios.get('http://localhost:8000/api/user', { withCredentials: true })
      ]);

      // Sort posts by number of likes descending
      const sortedPosts = postsRes.data.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

      setAllPosts(sortedPosts);
      setUserName(userRes.data.user.name);
      setUserId(userRes.data.user._id);
    } catch (err) {
      console.error('Fetch error:', err);
      navigate('/main');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) {
      setError('Post cannot be empty.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/post', { title: newPost }, { withCredentials: true });
      setNewPost('');
      setError('');
      fetchData();
    } catch (err) {
      console.error('Post creation error:', err);
      setError('Failed to post. Try again.');
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/api/like`, { postId: postId }, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/post/${postId}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleLogout = () => {
    axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true })
      .then(() => navigate('/main'))
      .catch(err => console.log('Logout error:', err));
  };

  return (
    <div className='container mt-3'>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <h1 className="fs-1">Hi, {userName}</h1>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {/* New Post Input */}
      <div className='card mt-4'>
        <div className='card-body'>
          <form onSubmit={handlePostSubmit}>
            <div className="mb-2">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Share your idea..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <button className="btn btn-primary" type="submit">Post</button>
          </form>
        </div>
      </div>

      {/* Posts */}
      <div className='card mt-4'>
        <div className='card-body'>
          {allposts.length === 0 ? (
            <p className="text-muted">No posts available.</p>
          ) : (
            allposts.map((post) => (
              <div key={post._id} className="mb-4 border-bottom pb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <a href={`/bright_ideas/${post._id}`}>
                    <h4 className="mb-1">{post.title}</h4>
                  </a>
                  <span className="text-muted">by {post.userId?.name || 'Unknown'}</span>
                </div>

                <div className="mt-2 d-flex align-items-center gap-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleLike(post._id)}
                  >
                    Like
                  </button>
                  <span>{post.likes?.length || 0} liked</span>

                  {/* Show delete if current user owns the post */}
                  {post.userId?._id === userId && (
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
