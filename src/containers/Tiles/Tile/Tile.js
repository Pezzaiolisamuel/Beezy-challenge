import React from 'react';
import classes from './Tile.module.css';

const Tile = (props) => {
    return <div className={classes.Tile} onClick={props.click} > 
            <p>{props.Name}</p>
            <img src={props.Image}/>
        </div>
};

export default Tile;