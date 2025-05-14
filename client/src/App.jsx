import { Routes, Route, Navigate } from 'react-router-dom'
import LogReg from './components/LogReg'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import BrightIdeaDetails from './components/BrightIdeaDetails'

function App() {
  return (
    <>
     <Routes>
		<Route path="/" element={<Navigate to="/main" />} />
        <Route path='/main' element={<LogReg/>}/>
        <Route path='/bright_ideas' element={<Dashboard/>}/>
		<Route path='/bright_ideas/:id' element={<BrightIdeaDetails/>}/>
		<Route path='/users/:id' element={<Profile/>}/>
     </Routes>
    </>
  )
}

export default App
