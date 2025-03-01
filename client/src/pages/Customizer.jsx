import React, {useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state  from '../store'
import { download } from '../assets'
import {downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion' 
import { AIPicker, ColorPicker, FilePicker, CustomButton, Tab  } from '../components'

const Customizer = () => {
  const snap= useSnapshot(state);

  const [file, setFile] = useState('');
  const[generatingImg, setGeneratingImg]=useState('')
  
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState("")
  const [activeEditorTab, setActiveEditorTab] = useState("")
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt:true,
    stylishShirt: false,
  })

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} 
        readFile ={readFile}
        />;
      case "aipicker":
        return <AIPicker
        prompt={prompt}
        setPrompt={setPrompt}
        handleSubmit={handleSubmit}
           />;
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if(!prompt) return alert("please enter a prompt");
    try{
      setGeneratingImg(true);

      const response =  await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json();

      handleDecals(type,`data:image/png;base64,${data.photo}`)
    } catch(error) {
      alert(error)
    }finally {
      setGeneratingImg(false);    //check this
      setActiveEditorTab("");
    }
    }

  
  const handleDecals = (type, result) =>{
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;
    if(!activeFilterTab[decalType.FilterTab]) {
      handleActiveFilterTab(decalType.FilterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch(tabName){
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
        case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
          console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);
          break;
          default:
            state.isLogoTexture = true;
           state.isFullTexture =false;
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
      [tabName]: !prevState[tabName]
      }
    })
  }
  
  const readFile = (type) => {
    reader(file)
    .then((result) =>{
      handleDecals(type, result);
      setActiveEditorTab("")
    })
  
}

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
          key="custom"
          className="absolute top-0 left-0 z-10"
          {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab)=> (
                  <Tab
                  key={tab.name}
                  tab={tab}
                  handleClick={()=> setActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
          className="absolute z-10 top-5 right-5"
          {...fadeAnimation}
          >
            <CustomButton
            type="filled"
            title="Go Back"
            handleClick={() => state.intro = true}
            customStyle="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div               
          className="filtertabs-container"   /* this will have some error*/
          {...slideAnimation('up')}
          >
          <div className="relative h-32 w-32 ...">
           <div className="absolute inset-x-0 bottom-0 flex flex-row h-16 ...">
              {FilterTabs.map((tab)=> (
                  <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={()=> handleActiveFilterTab(tab.name)}
                  />
                ))}
            </div>
          </div>
          


          </motion.div>
        </>
      )}
    </AnimatePresence>
    
  )
}

export default Customizer
