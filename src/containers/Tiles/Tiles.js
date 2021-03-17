import React,{Component} from 'react';
import axios from 'axios';
import {NavLink, Route} from 'react-router-dom';
import classes from './Tiles.module.css';
import Tile from './Tile/Tile';
import Fulltile from './Fulltile/Fulltile';
import Filters from "../Filters/Filters";

class Tiles extends Component{
    constructor(props) {
        super(props);
        this.state={
            error: null,
            isLoaded: false,
            pokemons: [],
            pokemonSelected: null,
            pokemonsToShow : [],
            numberOfTilesShown: 0,
        };
    }
    
    componentDidMount(){
        if(this.state.pokemons.length === 0){
            new Promise((resolve, reject) => {
                return resolve(this.getPokemons());
            });
        }
        
    }

    

    //get pokemons available from api
    getPokemons(){
        let url= `https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0/`;
        return axios.get(url)
        .then(docs=>{
            if(docs){
                let pokemons = docs.data.results;
                this.setState({pokemons: pokemons});
                this.mapPokemons(pokemons);
            }else{
                alert("trow Error");
            }
        })
        .catch(error=> {
            // handle error
            console.log(error);
        })
    }

    mapPokemons(filter, numberOfPokemons){
        filter ? filter = filter : filter = this.state.pokemons;
        numberOfPokemons ? numberOfPokemons = numberOfPokemons : numberOfPokemons = 20;
        let pokemonsList ={
            now: filter.slice(0, numberOfPokemons),
            later: filter.slice(numberOfPokemons),
            arr : filter
        } 
        return Promise.all(
            // pokemons.slice(offset, limit).map(p =>{
            pokemonsList.now.map(p =>{
                // "https://pokeapi.co/api/v2/pokemon/${number}"
            return axios.get(p.url)
        })).then(res=>{
            let pokemonsData = res.map(p=>{
                return{
                    name: p.data.name,
                    id: p.data.id,
                    image: p.data.sprites.other.dream_world.front_default,
                    exp: p.data.base_experience,
                }});
            pokemonsList.now = [...pokemonsData];

            this.updatePokemons(pokemonsList, numberOfPokemons);
        })
    }

    updatePokemons(docs, numberOfPokemons){
        this.setState({isLoaded: true, pokemonsToShow: docs , numberOfTilesShown: numberOfPokemons});
    }
    
    handleSearchChanges(e){
        let searchWord= e.target.value.toLowerCase();
        this.setState({filterInput: searchWord})
        this.onSearch(searchWord);
    }
    
    onSearch(filter){
        let pokemons = [...this.state.pokemons];
        let filteredPokemon = pokemons.filter(p=> p.name.includes(filter) )
        this.mapPokemons(filteredPokemon);
    }
    
    loadMoreTiles(){
        document.querySelector('#load-more-btn').disabled = true;
        this.addPokemonsToList();
    }

    addPokemonsToList(){
        let numberOfTiles = this.state.numberOfTilesShown + 20;
        let pokemons = this.state.pokemonsToShow.arr;
        this.mapPokemons(pokemons, numberOfTiles);
        document.querySelector('#load-more-btn').disabled = false;
    }

    handlePokemonSelection(name){
        let selectedPokemon= this.state.pokemonsToShow.now.find((p) => p.name == name)
        console.log(selectedPokemon);
        this.setState({pokemonSelected : selectedPokemon})
    }

    render(){
        const { error, isLoaded, data } = this.state;
        
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const pokemonTiles = this.state.pokemonsToShow.now.map(p => (
                <NavLink className="nav-link"
                    to={`/pokemon${p.id}`} 
                    key={p.id} >
                    <Tile 
                        Image={p.image}
                        Name={p.name}
                        Experience={p.exp}
                        Key={p.id}
                        click={()=> this.handlePokemonSelection(p.name)}
                    />
                </NavLink>
            ))
            
            const loadMoreTile = <button className={classes.loadMoreTile}
                id="load-more-btn"
                onClick={()=>this.loadMoreTiles()}
                key={-1}
                >Load More Pokemons</button>;

            if(this.state.pokemonsToShow.later.length > 0){
                pokemonTiles.push(loadMoreTile);
            }  
            let offset = this.state.numberOfTilesShown - 20;

            return  <div>
                        <Route path="/" exact render={()=> <Filters value={this.state.filterInput} filtering={(e)=> this.handleSearchChanges(e)} offset={offset}/>} />
                        <div className={classes.Tiles}>
                            <Route path="/" exact render={()=> pokemonTiles} />
                            <Route path="/pokemon:id" render={()=><Fulltile 
                                    Image={this.state.pokemonSelected.image}
                                    Name={this.state.pokemonSelected.name}
                                    Experience={this.state.pokemonSelected.exp}
                                    Key={this.state.pokemonSelected.id}
                                /> } />
                        </div>
                    </div>
        }
    };
};
    

export default Tiles;