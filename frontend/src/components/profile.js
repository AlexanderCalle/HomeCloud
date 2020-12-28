import Axios from 'axios';
import React, { Component } from 'react';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('tokens'));

        Axios({method: 'GET', url: `http://localhost:3030/myprofile/${token.id}`})
            .then(res => {
                if(res.status === 200) {
                    this.setState(res.data);
                    console.log(this.state)
                }
            }).catch(e => console.log(e));
    }

    render() {
        return (
            <>
                <div className='flex flex-col space-y-16 items-center p-6'>
                    <div className='flex rounded-full h-32 w-32 justify-center items-center'>
                        <svg class="w-32 h-32 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
                    </div>
                    <div className="flex flex-col items-center space-y-8">
                        <div className="flex flex-col items-center space-y-2">
                            <div className='flex flex-row space-x-1'>
                                <p>name: </p>
                                <p>{this.state.firstname}</p>
                                <p>{this.state.lastname}</p>
                            </div>
                            <p>email: {this.state.email}</p>
                        </div>
                        <button type="button" className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Update profile
                        </button> 
                    </div>
                </div>
            </>
        )
    }
}

export default Profile;