import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
    let [files, setFiles] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getFiles()
    }, [])


    let getFiles = async() =>{
        let response = await fetch('https://api.calebscoolwebsite.com/api/files/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setFiles(data.files)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    let upload = async(e) =>{
        const formData = new FormData();
        const d = {'name': e.target.name.value, 'file': e.target.file.files[0]}
        for (const name in d){
            formData.append(name, d[name])
        }

        e.preventDefault()
        console.log({'name': e.target.name.value, 'file': e.target.file.files[0]})
        let response = await fetch('https://api.calebscoolwebsite.com/api/files/', {
            method:'POST',
            headers:{
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: formData
        })
        let data = await response.json()
        console.log(data)
        if(response.status === 201){
            setFiles(files => [...files, data])
            document.getElementById('upload-form').reset()
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    return (
        <div>
            <p>You are logged in to the home page!</p>


            <ul>
                {files.map(file => (
                    <li key={file.id} >{file.name}<a href={file.file} download > Download </a></li>
                ))}
            </ul>
            <form onSubmit={upload} id='upload-form'>
                <input type='text' id='name' placeholder='custom name'/>
                <input type='file' id='file'/>
                <button>Upload</button>
            </form>
        </div>
    )
}

export default HomePage
