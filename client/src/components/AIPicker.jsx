import React, { useState } from 'react';
import CustomButton from './CustomButton';

const AIPicker = ({ prompt, setPrompt, generatingImg, setGeneratingImg, setImage }) => {
  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt!');

    // setGeneratingImg(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/dalle/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setImage(data.photo); // Update the image state
      } else {
        alert(data.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error fetching AI image:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setGeneratingImg(false);
    }
  };

  return (
    <div className="aipicker-container">
      <textarea
        placeholder="Ask AI..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="aipicker-textarea"
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <CustomButton type="outline" title="Asking AI..." customStyles="text-xs" />
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
              customStyles="text-xs"
            />

            <CustomButton
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
              customStyles="text-xs"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;
