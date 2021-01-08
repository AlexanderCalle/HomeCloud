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
        console.log(this.state.selected);
    };
    
    render() {
        return (
            <div>
            {this.state.files.map((file => {
                return (
                    <div className="border-b" onClick={() => {
                        this.selectItem(file)
                    }}>
                        <div className={ file.isSelect ? styles.selected : styles.normal }>
                            {file.isSelect ? (
                                <>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </>
                            ) : (
                                <>
                                <svg width="1.5rem" height="1.5rem">
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
            
            </div>
        )
    }
}

const styles = {
    selected: "flex flex-row items-center border-l-2 border-blue-500 bg-blue-100",
    normal: "flex flex-row items-center border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100"
}

export default SelecingFiles;