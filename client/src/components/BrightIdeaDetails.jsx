import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function BrightIdeaDetails() {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [likedUsers, setLikedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Get post
        const res = await axios.get(`http://localhost:8000/api/post/${id}`)
        const post = res.data
        setIdea(post)

        // Step 2: Fetch each like’s user data
        const userRequests = post.likes.map((like) =>
          axios.get(`http://localhost:8000/api/like/${like._id}`).then(res => res.data)
        )

        const allUsers = await Promise.all(userRequests)

        // Step 3: Deduplicate by _id
        const uniqueUsersMap = new Map()
        allUsers.forEach(user => {
          if (!uniqueUsersMap.has(user._id)) {
            uniqueUsersMap.set(user._id, user)
          }
        })

        setLikedUsers(Array.from(uniqueUsersMap.values()))
        setLoading(false)
      } catch (err) {
        console.error('Error fetching idea or likes:', err)
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!idea) return <div>Post not found</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Like Status</h2>
      <p className="text-gray-600">
		<a href={`/users/${idea.userId._id}`} className="text-blue-500 underline"> 
		  {idea.userId.name}
		</a>
		{' '}
        says: {idea.title}
      </p>

      <h3 className="mt-4 font-semibold">People who liked this post:</h3>
      <table className="border mt-2 w-full max-w-md">
        <thead>
          <tr>
            <th className="border px-2 py-1">Alias</th>
            <th className="border px-2 py-1">Name</th>
          </tr>
        </thead>
        <tbody>
          {likedUsers.map(user => (
            <tr key={user.userId._id}>
              <td className="border px-2 py-1">
                <a href={`/users/${user.userId._id}`} className="text-blue-500 underline">
                  {user.userId.alias}
                </a>
              </td>
              <td className="border px-2 py-1">{user.userId.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BrightIdeaDetails
