import React from 'react';
import classes from './Filters.module.css';

const Filters = (props) => {
    // console.log(props)
    return <div className={classes.Filters} > 
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg" alt="a"/>
                
            	<input type="text" placeholder="Search" onChange={props.filtering} value={props.value}></input>
                <select>
                    <option>     First Id</option>
                    <option>  Last Id</option>
                    <option>  Experience</option>
                </select>
                <div className={classes.counter}>Showing {props.offset + 20} of 1118</div>
            </div>
};
    

export default Filters;