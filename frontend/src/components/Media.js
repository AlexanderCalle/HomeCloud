import React, { Component } from 'react';

class Media extends Component {
    
    constructor(props) {

        super(props);

        this.state = {
            chatId: this.props.chatId,
            media: [],
            page: 1,
            showImage: false,
            image: null
        }

    }

    componentDidMount() {
        // window.addEventListener('scroll', this.infiniteScroll);

        this.refs.myScroll.addEventListener('scroll', () => {
            if(
                this.refs.myScroll.scrollTop + this.refs.myScroll.clientHeight >= this.refs.myScroll.scrollHeight
            ) {
                this.infiniteScroll();
            }
        });

        this.fetchData(this.state.page);
    }

    fetchData = (pageNum) => {

        let mediaUrl = `http://${process.env.REACT_APP_HOST_IP}:3030/files/getMedia/${this.state.chatId}/page=/${this.state.page}`

        fetch(mediaUrl)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    media: [...this.state.media, ...data]
                })
            })
    }

    infiniteScroll = () => {

            let newPage = this.state.page;
            newPage++;

            this.setState({
                page: newPage
            })

            this.fetchData(newPage);
    }

    render() {
        return (
            <>
                <div ref="myScroll" id="mediaDiv" className="grid grid-cols-3 gap-2 2xl:h-80 h-64 overflow-y-auto">
                    {this.state.media.map((item) => (
                        <div className="2xl:w-28 2xl:h-28 h-24 w-24 bg-gray-500">
                            <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + item.path} className="w-full h-full object-cover" onClick={() => this.setState({showImage: true, image: item.path})} />
                        </div>
                    ))}
                </div>

                {this.state.showImage && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-80"></div>
                            </div>
                            <span  className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
                            <span onClick={() => this.setState({showImage: false})} className="cursor-pointer focus:outline-none absolute flex flex-row justify-center items-center top-2 right-2 h-9 w-9 text-white rounded-full bg-black opacity-50">&#10005;</span>
                            <div className="inline-block overflow-hidden shadow-xl transform align-middle lg:max-w-2xl md:max-w-lg sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                <img className="w-full h-full" src={'http://' + process.env.REACT_APP_HOST_IP + ':3030' + this.state.image} />
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

}

export default Media;