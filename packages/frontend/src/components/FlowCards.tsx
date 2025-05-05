import { useState, useEffect } from 'react';
import ReactFlow, {
    Controls,
    useNodesState,
    useEdgesState,
    Background,
    Handle,
    Position,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

const descriptions = {
    Plan: {
        title: 'Discovery & Planning',
        details: 'Understanding the problem, gathering a team, setting goals and timelines.'
    },
    Develops: {
        title: 'UI/UX Design',
        details: 'Designing wireframes, prototypes, and user flows to ensure a smooth experience.'
    },
    Test: {
        title: 'Development',
        details: 'Coding features, integrating systems, and writing unit tests.'
    },
    Deploy: {
        title: 'Testing & QA',
        details: 'Running tests, fixing bugs, and validating the application quality.'
    },
    Review: {
        title: 'Deployment to Production',
        details: 'Deploying the final product to production environments with monitoring.'
    },
    Done: {
        title: 'Post-Launch Support',
        details: 'Providing maintenance, support, and gathering user feedback.'
    },
};

const initialNodes =[
    {
        "id": "1",
        "position": {
            "x": -359.55244159693507,
            "y": -228.14960273941628
        },
        "data": {
            "label": "Discovery & Planning",
            "label1": "Plan",
            "status": "done",
            "index": 0
        },
        "draggable": true,
        "className": "!border-0 !p-0",
        "width": 150,
        "height": 58,
        "selected": false,
        "positionAbsolute": {
            "x": -359.55244159693507,
            "y": -228.14960273941628
        },
        "dragging": false
    },
    {
        "id": "2",
        "position": {
            "x": -468.1931877063355,
            "y": -128.37485636958024
        },
        "data": {
            "label": "UI/UX Design",
            "label1": "Develops",
            "status": "done",
            "index": 1
        },
        "draggable": true,
        "className": "!border-0 !p-0",
        "width": 150,
        "height": 38,
        "selected": false,
        "positionAbsolute": {
            "x": -468.1931877063355,
            "y": -128.37485636958024
        },
        "dragging": false
    },
    {
        "id": "3",
        "position": {
            "x": -333.260523561741,
            "y": -51.5350404248845
        },
        "data": {
            "label": "Development",
            "label1": "Develops",
            "status": "done",
            "index": 2
        },
        "draggable": true,
        "className": "!border-0 !p-0",
        "width": 150,
        "height": 38,
        "selected": false,
        "positionAbsolute": {
            "x": -333.260523561741,
            "y": -51.5350404248845
        },
        "dragging": false
    },
    {
        "id": "4",
        "position": {
            "x": -459.88485495969826,
            "y": 7.381599357505422
        },
        "data": {
            "label": "Testing & QA",
            "label1": "Testing",
            "status": "done",
            "index": 3
        },
        "draggable": true,
        "className": "!border-0 !p-0",
        "width": 150,
        "height": 38,
        "selected": false,
        "positionAbsolute": {
            "x": -459.88485495969826,
            "y": 7.381599357505422
        },
        "dragging": false
    },
    {
        "id": "5",
        "position": {
            "x": -297.69099395899286,
            "y": 58.664967919353046
        },
        "data": {
            "label": "Deployment to Production",
            "label1": "Deploy",
            "status": "done",
            "index": 4
        },
        "draggable": true,
        "className": "!border-0 !p-0",
        "width": 150,
        "height": 58,
        "selected": true,
        "positionAbsolute": {
            "x": -297.69099395899286,
            "y": 58.664967919353046
        },
        "dragging": false
    },
    {
        "id": "6",
        "position": {
            "x": -466.90504672614577,
            "y": 137.07448202752158
        },
        "data": {
            "label": "Post-Launch Support",
            "label1": "Done",
            "status": "done",
            "index": 5
        },
        "draggable": true,
        "className": "!border-0 !p-0",
        "width": 150,
        "height": 58,
        "selected": false,
        "positionAbsolute": {
            "x": -466.90504672614577,
            "y": 137.07448202752158
        },
        "dragging": false
    }
]

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
];

const NodeComponent = ({ data }: any) => {
    let bgClass = 'bg-neutral-200 text-gray-900 border border-gray-300';
    if (data.status === 'done') bgClass = 'bg-green-100 text-green-800 border border-green-200';
    else if (data.status === 'current') bgClass = 'bg-blue-100 text-blue-800 border border-blue-200';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: data.index * 0.2,
            }}
            className={`group text-sm px-4 py-2 relative text-center rounded-2xl ${bgClass} shadow-sm backdrop-blur-sm`}
        >
            <div className="font-medium">{data.label}</div>
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs rounded px-2 py-1 shadow z-10">
                {`Step: ${data.label}`}
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </motion.div>
    );
};

const nodeTypes = { default: NodeComponent };

const FlowChartCore = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [botPos, setBotPos] = useState({ x: 400, y: -17 });
    console.log(botPos)
    const currentLabel = nodes[currentIndex]?.data.label1 || 'Done';
    const currentDescription = descriptions[currentLabel] || {
        title: 'Unknown',
        details: 'No description available.',
    };
    console.log(nodes)
    const updateBotPosition = (index: number) => {
        const actualIndex = index >= nodes.length ? nodes.length - 1 : index;
        const node = nodes[actualIndex];
        if (!node) return;
        const domNode = document.querySelector(`[data-id="${node.id}"]`);
        const container = document.querySelector('.react-flow__viewport');
        if (!(domNode instanceof HTMLElement) || !(container instanceof HTMLElement)) return;
        const nodeRect = domNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const botX = nodeRect.right - containerRect.left - 30;
        const botY = nodeRect.top - containerRect.top - 100;
        setBotPos({ x: botX, y: botY });
    };
    //
    // useEffect(() => {
    //     const timeout = setTimeout(() => updateBotPosition(currentIndex), 100);
    //     return () => clearTimeout(timeout);
    // }, [nodes, currentIndex]);

    const handleNextStep = () => {
        const isFinalNode = currentIndex === nodes.length - 1;
        const isDoneStage = currentIndex === nodes.length;
        if (isDoneStage) return;
        if (isFinalNode) {
            setNodes((nds) =>
                nds.map((node, index) =>
                    index === currentIndex ? { ...node, data: { ...node.data, status: 'done' } } : node
                )
            );
            setCurrentIndex(currentIndex + 1);
            return;
        }
        setNodes((nds) =>
            nds.map((node, index) => {
                if (index < currentIndex + 1) return { ...node, data: { ...node.data, status: 'done' } };
                if (index === currentIndex + 1) return { ...node, data: { ...node.data, status: 'current' } };
                return node;
            })
        );
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setTimeout(() => updateBotPosition(nextIndex), 100);
    };

    const handleRestart = () => {
        const resetNodes = initialNodes.map((node, index) => ({
            ...node,
            data: {
                ...node.data,
                status: index === 0 ? 'current' : 'upcoming',
                index: node.data.index,
            },
        }));
        setNodes(resetNodes);
        setCurrentIndex(0);
        setTimeout(() => updateBotPosition(0), 100);
    };

    return (
        <div className="w-[70%] mx-auto h-[450px] flex flex-col items-center bg-gray-50 relative overflow-hidden">
            {/* Floating Buttons */}
            <div className="mb-4 flex gap-3 z-20 absolute bg-white right-[20px] p-6 top-[0]">
                <button
                    onClick={handleNextStep}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-xl hover:bg-blue-600 transition disabled:opacity-50 text-sm font-medium shadow-sm"
                    disabled={currentIndex > nodes.length}
                >
                    Next Step
                </button>
                <button
                    onClick={handleRestart}
                    className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-xl hover:bg-gray-300 transition text-sm font-medium shadow-sm"
                >
                    Restart
                </button>
            </div>

            {/* Floating Side Panel */}
            <div className="absolute left-4 top-6 w-50 bg-white/70  rounded-2xl p-4 z-20 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{currentDescription.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{currentDescription.details}</p>
            </div>

            {/* Main React Flow Canvas */}
            <div className="flex w-full h-full border border-gray-200 rounded-2xl shadow-md bg-white p-4 relative">
                {/* Bot */}
                {/*<div*/}
                {/*    style={{*/}
                {/*        transform: `translate(${botPos.x}px, ${botPos.y}px)`,*/}
                {/*        transition: 'transform 0.6s ease-in-out',*/}
                {/*    }}*/}
                {/*    className="absolute z-50 pointer-events-none"*/}
                {/*>*/}
                {/*    <img src={giniBot} height={40} width={40} alt="gini-bot" />*/}
                {/*</div>*/}

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView

                    // defaultViewport={{ x: -200, y: 0, zoom: 1 }} // Important: ensures top-left anchor

                    nodeTypes={nodeTypes}
                    panOnDrag={true}
                    panOnScroll={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                >
                    {/*<Controls />*/}
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
};

const FlowChart = () => (
    <ReactFlowProvider>
        <FlowChartCore />
    </ReactFlowProvider>
);

export default FlowChart;
