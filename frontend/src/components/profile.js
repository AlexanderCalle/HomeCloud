import Axios from 'axios';
import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            updatedUser: {},
            avatar: {},
            totalFiles: 0,
            totalFolders: 0,
            totalFriends: 0,
            progress: 0,
            space: 0,
        }
    }

    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('tokens'));

        Axios({method: 'GET', url: `http://${process.env.REACT_APP_HOST_IP}:3030/myprofile/${token.id}`})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        user: res.data.user,
                        updatedUser: res.data.user,
                        totalFiles: res.data.files,
                        totalFolders: res.data.folders,
                        totalFriends: res.data.friends,
                        hovered: false
                    });
                }
            }).catch(e => console.log(e));

        Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/directorySize/${token.id}`)
            .then(res => {
              if(res.status === 200) {
                var percentage = res.data.totalSizeBytes
                this.setState({
                    progress: percentage,
                    space: res.data.totalSize
                })
              }
            })
    }

    UpdatingUser = (user) => {
        const data = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        }

        axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/myprofile/updateuser/${user.id}`, data)
            .then(res => {
                if(res.status === 200) {
                    this.props.setIsUpdating(false);
                    window.location.reload();
                }
            })

    }

    UpdatingUserPic = (user) => {
        console.log('pok');
    }

    handleEvent = () => {
        var input = document.getElementById('upload');
        input.click();
    }

    handleChange = async (e) => {
        const data  = new FormData();
        data.append('file', e.target.files[0]);

        const token = JSON.parse(localStorage.getItem('tokens'));

        Axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/myprofile/uploadPic/${token.id}`, data, {
            onUploadProgress: (ProgressEvent) => {
                console.log(ProgressEvent.loaded);
            }
        })
        .then((res) => {
            if(res.status === 200) {
                const data = {
                    ...token,
                    profile_pic: res.data.profile_pic
                }
                localStorage.setItem('tokens', JSON.stringify(data))
                window.location.reload();
            } else {
                console.log(res.data);
            }
        })
    }

    render() {
        return (
            <>
            <div className="flex flex-col w-2/3 2xl:h-1/2 bg-gray-100 rounded-2xl shadow-xl">
               <div className="flex flex-row justify-center 2xl:justify-between py-4 px-16">
                    <div className="absolute 2xl:relative hidden 2xl:flex flex-row justify-between px-6 py-2 w-72 h-16">
                        <div className="flex flex-col items-center">
                            <p className="font-medium">{this.state.totalFiles}</p>
                            <p className="font-light">Files</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-medium">{this.state.totalFolders}</p>
                            <p className="font-light">Folders</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-medium">{this.state.totalFriends}</p>
                            <p className="font-light">Friends</p>
                        </div>
                    </div>
                    <div onClick={this.handleEvent} id="div" onMouseEnter={()=> this.setState({hovered: true})} onMouseLeave={()=> this.setState({hovered: false})} className='-mt-24 flex cursor-pointer rounded-full h-40 w-40 hover:bg-gray-200 justify-center items-center focus:outline-none shadow-2xl'>
                        {this.state.hovered && (
                            <svg class="w-10 h-10 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        )}
                        <input type="file" id="upload" onChange={(e) => this.handleChange(e)} accept="image/*" hidden="true" />
                        {this.state.user.profile_pic != null && <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + this.state.user.profile_pic} className="absolute object-cover w-40 h-40 rounded-full hover:opacity-30" />}
                        {this.state.user.profile_pic == null && <svg id="svgProfile" class="w-40 h-40 text-gray-900 stroke-1 hover:opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </div>
                    <div className="absolute 2xl:relative hidden 2xl:flex flex-row w-72 h-10 py-2">
                        <div className="w-full">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cornblue-600 bg-cornblue-200">
                                            Available Space
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-center space-x-2 text-right">
                                        <span className="text-xs font-bold inline-block text-cornblue-400">
                                            { this.state.progress > 0 && this.state.space + '/5.0 GB' }
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-cornblue-200">
                                    <div style={{ width: this.state.progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cornblue-600"></div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="mt-14 flex flex-col flex-auto items-center space-y-10 pb-8">
                    <>
                        {this.props.isUpdating ? (
                            <div className="mt-12 flex flex-col 2xl:w-1/2 w-2/3">
                                <input className="h-10 border-t border-l border-r border-gray-400 rounded-t-lg p-2" value={this.state.updatedUser.firstname} onChange={(e) => this.setState({updatedUser: {...this.state.updatedUser, firstname: e.target.value}})} type="text" placeholder="Firstname..."/>
                                <input className="h-10 border border-gray-400 p-2" type="text" value={this.state.updatedUser.lastname} onChange={(e) => this.setState({updatedUser: {...this.state.updatedUser, lastname: e.target.value}})} placeholder="Lastname..."/>
                                <input className="h-10 border-b border-l border-r border-gray-400 rounded-b-lg p-2" value={this.state.updatedUser.email} onChange={(e) => this.setState({updatedUser: {...this.state.updatedUser, email: e.target.value}})} type="text" placeholder="Email..."/>
                            </div>
                        ) : (
                            <>
                            <h1 className="font-bold text-2xl">{this.state.user.firstname} {this.state.user.lastname}</h1>
                            <h2 className="text-lg font-medium"><span className="text-gray-500">@</span> {this.state.user.email}</h2>
                            </>
                        )}
                    </>
                    <div className="2xl:absolute 2xl:hidden flex flex-col w-3/4 space-y-10">
                        <div className="flex flex-row flex-auto justify-center space-x-8">
                            <div className="flex flex-col items-center">
                                <p className="font-medium">{this.state.totalFiles}</p>
                                <p className="font-light">Files</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="font-medium">{this.state.totalFolders}</p>
                                <p className="font-light">Folders</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="font-medium">{this.state.totalFriends}</p>
                                <p className="font-light">Friends</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cornblue-600 bg-cornblue-200">
                                                Available Space
                                            </span>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2 text-right">
                                            <span className="text-xs font-bold inline-block text-cornblue-400">
                                                { this.state.progress > 0 && this.state.space + '/5.0 GB' }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-cornblue-200">
                                        <div style={{ width: this.state.progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cornblue-600"></div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 h-24">
                    <div className="flex items-center justify-center border-t-2">
                        {this.props.isUpdating ? (
                            <div className="mt-4 flex 2xl:flex-row flex-row space-x-4 ">
                                <button className="bg-cornblue-200 text-cornblue-400 w-32 h-10 rounded-md outline-none" onClick={() => this.props.setIsUpdating(!this.props.isUpdating)}>Cancel</button>
                                <button className="bg-cornblue-400 text-cornblue-200 w-32 h-10 rounded-md outline-none" onClick={() => this.UpdatingUser(this.state.updatedUser)}>Update Profile</button>
                            </div>
                        ) : (
                            <button className="mt-5 font-medium text-cornblue-400 outline-none" onClick={() => this.props.setIsUpdating(!this.props.isUpdating)}>Edit profile</button>
                        )}
                    </div>
                </div>
            </div>
                {/* <div className='flex flex-col space-y-16 items-center p-6'>
                    <div onClick={this.handleEvent} id="div" onMouseEnter={()=> this.setState({hovered: true})} onMouseLeave={()=> this.setState({hovered: false})} className='flex cursor-pointer rounded-full h-32 w-32 hover:bg-gray-200 justify-center items-center focus:outline-none'>
                        {this.state.hovered && (
                            <svg class="w-10 h-10 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        )}
                        <input type="file" id="upload" onChange={(e) => this.handleChange(e)} accept="image/*" hidden="true" />
                        {this.state.user.profile_pic != null && <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + this.state.user.profile_pic} className="absolute object-cover w-32 h-32 rounded-full hover:opacity-10" />}
                        {this.state.user.profile_pic == null && <svg id="svgProfile" class="w-32 h-32 text-gray-900 stroke-1 hover:opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
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
                </div> */}
            </>
        )
    }
}

const styles = {
    input: "w-64 h-8 p-2 focus:ring-blue-500 focus:border-blue-500 border border-blue-500 sm:text-sm rounded-md shadow-xl"
}

export default Profile;