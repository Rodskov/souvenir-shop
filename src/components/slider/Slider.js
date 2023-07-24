import React, { useEffect, useState } from 'react'
import {AiOutlineArrowLeft, AiOutlineArrowRight} from "react-icons/ai"
//import { sliderData } from './Slider-data'
import {ExportData} from './Slider-data'
import './Slider.scss'

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideLength = ExportData().length;

    const autoScroll = true
    let slideInterval;
    let intervalTime = 5000;

    const nextSlide = () => {
        setCurrentSlide( currentSlide === slideLength -1 ? 0:currentSlide + 1);
    };
    const prevSlide = () => {
        setCurrentSlide( currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
    };

    useEffect(()=>{
        setCurrentSlide(0)
    }, [])

    

    useEffect(()=>{
        if (autoScroll) {
            const auto = () => {
                slideInterval = setInterval(nextSlide, intervalTime);
            };
            auto()
        }
        return () => clearInterval(slideInterval);
    }, [currentSlide, slideInterval, autoScroll]);

  return (
    
    <div className='slider'>
        <AiOutlineArrowLeft className = 'arrow prev' onClick={prevSlide}/>
        <AiOutlineArrowRight className = 'arrow next' onClick={nextSlide}/>
        { ExportData().map ((slide, index) =>{
            const {image} = slide
            return(
                //Kapag dynamic william dapat key yung sasabihin lalagyan key yung nasa slider-data.js watch mo tutorial 33
                <div key={index} className={index === currentSlide ? "slide current" : "slide"}>
                    {index === currentSlide && (
                        <>
                            <img src={image} alt='slide'/>
                            
                        </>
                    )}
                </div>
            )
        })}
    </div>
  )
}

export default Slider