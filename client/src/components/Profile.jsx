import React, { useEffect, useState } from 'react';
import { useParams, Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
const navigate=useNavigate()
  useEffect(() => {
    fetch(`http://localhost:8000/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Error fetching user:', err));
  }, [id]);
  const handleLogout = () => {
    axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true })
      .then(() => navigate('/main'))
      .catch(err => console.log('Logout error:', err));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
		
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        <div style={{ marginTop: '2rem' }}>
        	<Link to="/bright_ideas">Bright Ideas</Link> | <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      	</div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Alias:</strong> {user.alias}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <p><strong>Total Number of Posts:</strong> {user.posts.length}</p>
      <p><strong>Total Number of Likes:</strong> {user.likes.length}</p>


    </div>
  );
};

export default UserProfile;
