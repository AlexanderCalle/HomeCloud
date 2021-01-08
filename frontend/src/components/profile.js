import Axios from 'axios';
import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            updatedUser: {},
        }
    }

    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('tokens'));

        Axios({method: 'GET', url: `http://${process.env.REACT_APP_HOST_IP}:3030/myprofile/${token.id}`})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        user: res.data,
                        updatedUser: res.data
                    });
                }
            }).catch(e => console.log(e));
    }

    UpdatingUser = (user) => {
        const data = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        }

        axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/updateuser/${user.id}`, data)
            .then(res => {
                if(res.status === 200) {
                    this.props.setIsUpdating(false);
                    window.location.reload();
                }
            })

    }

    render() {
        return (
            <>
                <div className='flex flex-col space-y-16 items-center p-6'>
                    <div className='flex rounded-full h-32 w-32 justify-center items-center'>
                    <svg class="w-32 h-32 text-gray-900 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="flex flex-col items-center space-y-8">
                        <div className="flex flex-col items-center space-y-2">
                            {!this.props.isUpdating ? (
                                <>
                                <div className='flex flex-row space-x-1'>
                                    <p>name: </p>
                                    <p>{this.state.user.firstname}</p>
                                    <p>{this.state.user.lastname}</p>
                                </div>
                                <p>email: {this.state.user.email}</p>
                                </>
                            ): (
                                <div className='flex flex-col space-y-2'>
                                    <input type="text" value={this.state.updatedUser.firstname} onChange={(e) => this.setState({updatedUser: {...this.state.updatedUser, firstname: e.target.value}})} className={styles.input} />
                                    <input type="text" value={this.state.updatedUser.lastname} onChange={(e) => this.setState({updatedUser: {...this.state.updatedUser ,lastname: e.target.value}})} className={styles.input} />
                                    <input type="email" value={this.state.updatedUser.email} onChange={(e) => this.setState({updatedUser: {...this.state.updatedUser , email: e.target.value}})} className={styles.input} />
                                </div>
                            )}
                        </div>
                        {this.props.isUpdating ? (
                            <button type="button" onClick={() => this.UpdatingUser(this.state.updatedUser)} className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Update profile
                            </button> 
                        ): (
                            <button type="button" onClick={() => this.props.setIsUpdating(!this.props.isUpdating)} className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Update profile
                            </button> 
                        )}
                        {this.props.isUpdating && (
                            <button type="button" onClick={() => this.props.setIsUpdating(!this.props.isUpdating)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </>
        )
    }
}

const styles = {
    input: "w-64 h-8 p-2 focus:ring-blue-500 focus:border-blue-500 border border-blue-500 sm:text-sm rounded-md shadow-xl"
}

export default Profile;