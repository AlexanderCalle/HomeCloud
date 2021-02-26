import React, { Component } from 'react';
import Axios from 'axios';

let selected = [];

class SelecingFiles extends Component {
    
    constructor(props) {
        super(props);
        this.folderId = props.folderId;
        this.state = {
            files: [],
            file: null,
            selected: []
        }
    }

    componentDidMount() {
        let combined = [];
        Axios({method: 'GET', url:`http://${process.env.REACT_APP_HOST_IP}:3030/folders/folder/` + this.folderId})
          .then(res => {
            if(res.status === 200) {
              if(res.data !== "no data") {
                const files = res.data;
                if(files.length > 0) {
                    files.forEach(file => {
                        const obj = {...file, isSelect: false};
                        combined.push(obj);
                    })
                }
                this.setState({ files: combined });
              } 
            }
        });
    }

    selectItem = (item) => {
        item.isSelect = !item.isSelect;
        if(item.isSelect){
            const obj = {
                name: item.name,
                file: item.path,
                filename: item.name,
                is_image: item.is_image,
                fileId: item.file_id
            };
            selected.push(obj);
        } else {
            for(let i = 0; i < selected.length; i++) {
                if(selected[i].fileId === item.file_id) {
                    selected.splice(i, 1)
                }
            }
        }
        this.setState({selected: selected});
        this.props.setSelected(selected)
    };

    // selectAll = () => {
    //     this.state.files.forEach(item => {
    //         item.isSelect = !item.isSelect;
    //         if(item.isSelect){
    //             const obj = {
    //                 name: item.name,
    //                 file: item.path,
    //                 filename: item.name,
    //                 is_image: item.is_image,
    //                 fileId: item.file_id
    //             };
    //             selected.push(obj);
    //         }
    //     })
    //     this.setState({selected: selected});
    //     this.props.setSelected(selected)
    // }
    
    render() {
        return (
            <>
            {this.state.files.map((file => {
                return (
                    <div className={file.isSelected ? styles.selected : styles.normal} onClick={() => {
                        this.selectItem(file)
                    }}>
                        <div className="flex flex-row items-center">
                            {file.isSelect ? (
                                <>
                                <svg class="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </>
                            ) : (
                                <>
                                <svg class="ml-2" width="1.5rem" height="1.5rem">
                                    <circle cx="0.7rem" cy="0.7rem" r="0.50rem" stroke="currentColor" stroke-width="2" fill="none" />
                                </svg>
                                </>
                            )}
                            <a className="flex-auto cursor-pointer ">
                                <div className="p-3 space-y-4">
                                    <div className="flex flex-row items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        <strong className="flex-grow text-sm font-normal">{file.name}</strong>
                                    </div>
                                </div>
                            </a>

                        </div>
                    </div>
            )
            }))}
            
            </>
        )
    }
}

const styles = {
    selected: "border border-cornblue-400 rounded-md shadow-md bg-cornblue-200 text-white",
    normal: "border border-gray-400 rounded-md shadow-md hover:border-cornblue-400 hover:bg-cornblue-200 hover:text-white"
}

export default SelecingFiles;