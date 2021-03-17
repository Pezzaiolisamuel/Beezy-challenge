import React from 'react';
import classes from './Fulltile.module.css';
import {NavLink} from 'react-router-dom';


const Fulltile = (props) => {

    return <div className={classes.Fulltile}>
                <NavLink to="/"> Go Back to list</NavLink>
                <div className={classes.display}>
                    <div className={classes.info}>
                        <p>{props.Name}</p>
                        <p>ID: {props.Key}</p>
                        <p>ptEXP: {props.Experience}</p>
                    </div>
                    <img src={props.Image} />
                </div>
            </div>
};

export default Fulltile;