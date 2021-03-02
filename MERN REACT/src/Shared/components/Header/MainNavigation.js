import React ,{Component} from 'react';
import MainHeader from'./MainHeader';
import { Link } from 'react-router-dom';
import NavLinks from './Navlinks';
import Sidedrawer from './SideDrawer';
import Backdrop from'../UI/Backdrop';
import './MainNavigation.css';


class MainNavigation extends Component{

    state ={
        drawerisOpen: false
    }

OpenDrawer=()=>{
    this.setState({drawerisOpen:true})
}


ClosedDrawer=()=>{
    this.setState({drawerisOpen:false})
}
    render()
    {

return (
    <React.Fragment>
        {this.state.drawerisOpen && <Backdrop onClick={this.ClosedDrawer}/>}

    <Sidedrawer show={this.state.drawerisOpen} onClick={this.ClosedDrawer}>
    <nav className='main-navigation__drawer-nav'>
    <NavLinks/>
    </nav>
</Sidedrawer>
  

    <MainHeader>

        <button className='main-navigation__menu-btn' onClick={this.OpenDrawer}>
            <span/>
            <span/>
            <span/>
        </button>
        <h1 className='main-navigation__title '>
           <Link  to='/'> EXPLORE </Link>
        </h1>
        <nav className='main-navigation__header-nav'>
            <NavLinks/>
        </nav>
    </MainHeader>
    </React.Fragment>
  );


}}

export default MainNavigation;