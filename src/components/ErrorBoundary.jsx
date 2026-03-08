import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorStr: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorStr: error?.message || 'Unknown error' };
    }

    componentDidCatch(error, errorInfo) {
        console.warn("React Runtime boundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="absolute inset-0 z-[99999] flex flex-col p-10 items-center justify-center bg-red-900 text-white font-mono text-sm overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Application Crashed</h2>
                    <p>{this.state.errorStr}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
