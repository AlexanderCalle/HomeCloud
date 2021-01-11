import React from 'react';

class WarningDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <form>
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-2 sm:p-1 sm:pt-6 sm:pb-4">
                        <div className="min-w-0 sm:flex sm:items-start">
                            <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-red-500" id="modal-headline">
                                Warning!
                            </h3>
                            <div className="mt-2">
                                <p>{this.props.msg}</p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="flex flew-row bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" onClick={this.props.closeDialog} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        )    
    }

}

export default WarningDialog