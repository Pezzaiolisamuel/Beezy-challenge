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
            items: [],
            pokemons: [],
            pokemonsPages:[],
            pageShown:0,
            pokemonsData: [],
            filteredPokemon: [],
            pokemonSelected: null,
            pokemonsToShow : [],
            limit: 20,
            offset:0,
        };
      }
    
    componentDidMount(){
        console.log("COMPONENT MOUNT")
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
                var perChunk = 20 // pokemons per page  (array of arrays) 

                var result = pokemons.reduce((resultArray, item, index) => { 
                const pageIndex = Math.floor(index/perChunk)

                if(!resultArray[pageIndex]) {
                    resultArray[pageIndex] = [] // start a new page
                }
                resultArray[pageIndex].push(item)

                return resultArray
                }, [])

                this.setState({pokemons: pokemons, pokemonsPages: result});
                this.mapPokemons();
            }else{
                alert("trow Error");
            }
        })
        .catch(error=> {
            // handle error
            console.log(error);
        })
    }

    mapPokemons(filter){
        console.log(this.state.pageShown)
        let pokemons = this.state.pokemonsPages[this.state.pageShown];
        // if no filters
        return Promise.all(
            // pokemons.slice(offset, limit).map(p =>{
            pokemons.map(p =>{
                // "https://pokeapi.co/api/v2/pokemon/${number}"
            return axios.get(p.url)
        })).then(res=>{
            let pokemonsData=[];
            let arr =  res.map(p=>{
                pokemonsData.push({
                    name: p.data.name,
                    id: p.data.id,
                    image: p.data.sprites.other.dream_world.front_default,
                    exp: p.data.base_experience,
                })
            })
            this.updatePokemons(pokemonsData);
        })
    }

    updatePokemons(docs){
        this.setState({isLoaded: true, pokemonsData: docs});
    }
    
    handleSearchChanges(e){
        let searchWord= e.target.value.toLowerCase();
        this.setState({filterInput: searchWord})
        this.onSearch(searchWord);
    }
    
    onSearch(filter){
        let pokemons = [...this.state.pokemons];
        let filteredPokemon = pokemons.filter(p=> p.name.includes(filter) )
        this.findPokemonData(filteredPokemon);
        this.mapPokemons(filteredPokemon);
    }

    findPokemonData(arr){
        console.log(arr);
    }

    addPokemonsToList(){
        // let newPokemonSet;
        // this.state.filteredPokemon.length > 0 && this.state.isMoreAvailable? newPokemonSet= this.state.filteredsPokemon : newPokemonSet =  this.state.pokemonsData;
        // // newPokemonSet.push(...docs);
        // console.log(this.state.filteredPokemon);
        // console.log(newPokemonSet);
        let addAPage = this.state.pageShown+1;
        this.setState({ pageShown: addAPage});  
        document.querySelector('#load-more-btn').disabled = false;
        this.mapPokemons();

    }



    handlePokemonSelection(id){
        let selectedPokemon= this.state.pokemonsData.findIndex((p, i) => p.name == this.state.pokemons[id -1].name)
        this.setState({pokemonSelected : selectedPokemon})
    }

    loadMoreTiles(){
        document.querySelector('#load-more-btn').disabled = true;
        this.addPokemonsToList();
    }

    

    render(){
        const { error, isLoaded, data } = this.state;
        
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const pokemonTiles = this.state.pokemonsToShow.map(p => (
                <NavLink className="nav-link"
                    to={`/pokemon${p.id}`} 
                    key={p.id} >
                    <Tile 
                        Image={p.image}
                        Name={p.name}
                        Experience={p.exp}
                        Key={p.id}
                        click={()=> this.handlePokemonSelection(p.id)}
                    />
                </NavLink>
            ))
            
            
            const loadMoreTile = <button className={classes.loadMoreTile}
                                    id="load-more-btn"
                                    onClick={()=>this.loadMoreTiles()}
                                    key={-1}
                                    >Load More Pokemons</button>;
            pokemonTiles.push(loadMoreTile)

            let offset =this.state.offset;
            


            return  <div>
                        <Route path="/" exact render={()=> <Filters value={this.state.filterInput} filtering={(e)=> this.handleSearchChanges(e)} offset={offset}/>} />
                        <div className={classes.Tiles}>
                            <Route path="/" exact render={()=> pokemonTiles} />
                            <Route path="/pokemon:id" render={()=><Fulltile 
                                    Image={this.state.pokemonsData[this.state.pokemonSelected].image}
                                    Name={this.state.pokemonsData[this.state.pokemonSelected].name}
                                    Experience={this.state.pokemonsData[this.state.pokemonSelected].exp}
                                    Key={this.state.pokemonsData[this.state.pokemonSelected].id}
                                /> } />
                        </div>
                    </div>
        }
    };
};
    

export default Tiles;