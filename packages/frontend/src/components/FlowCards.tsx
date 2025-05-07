import {memo, useState} from 'react';
import ReactFlow, {
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
    },
    design: {
        title: 'UI/UX Design',
    },
    Developer: {
        title: 'Development',
    },
    QA: {
        title: 'Testing & QA',
    },
    DEVOPS: {
        title: 'Deployment to Production',
    },
    Done: {
        title: 'Post-Launch Support',
    },
};

const roles = {
    Plan: 'PM',
    design: 'Designer',
    Developer: 'Developer',
    QA: 'QA Engineer',
    DEVOPS: 'DevOps',
    Done: 'Support'
};

const initialNodes = [
    {
        id: "1",
        position: { x: -359, y: -228 },
        data: {
            label: "Discovery & Planning",
            label1: "Plan",
            status: "done",
            index: 0,
            avatarUrl: "https://i.pravatar.cc/40?u=1"
        },
        draggable: false,
        className: "!border-0 !p-0",
    },
    {
        id: "2",
        position: { x: -468, y: -128 },
        data: {
            label: "UI/UX Design",
            label1: "design",
            status: "done",
            index: 1,
            avatarUrl: "https://i.pravatar.cc/40?u=2"
        },
        draggable: false,
        className: "!border-0 !p-0",
    },
    {
        id: "3",
        position: { x: -333, y: -51 },
        data: {
            label: "Development",
            label1: "Developer",
            status: "done",
            index: 2,
            avatarUrl: "https://i.pravatar.cc/40?u=3"
        },
        draggable: false,
        className: "!border-0 !p-0",
    },
    {
        id: "4",
        position: { x: -459, y: 7 },
        data: {
            label: "Testing & QA",
            label1: "QA",
            status: "done",
            index: 3,
            avatarUrl: "https://i.pravatar.cc/40?u=4"
        },
        draggable: false,
        className: "!border-0 !p-0",
    },
    {
        id: "5",
        position: { x: -297, y: 58 },
        data: {
            label: "Deployment to Production",
            label1: "DEVOPS",
            status: "done",
            index: 4,
            avatarUrl: "https://i.pravatar.cc/40?u=5"
        },
        draggable: false,
        className: "!border-0 !p-0",
    },
    {
        id: "6",
        position: { x: -466, y: 137 },
        data: {
            label: "Post-Launch Support",
            label1: "Done",
            status: "done",
            index: 5,
            avatarUrl: "https://i.pravatar.cc/40?u=6"
        },
        draggable: false,
        className: "!border-0 !p-0",
    }
];

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
            transition={{ duration: 0.5, ease: 'easeOut', delay: data.index * 0.2 }}
            className={`text-sm px-4 py-2 relative text-center rounded-2xl ${bgClass} shadow-sm backdrop-blur-sm w-max`}
        >
            <div className="font-medium text-left whitespace-normal break-words w-max">
                {data.label}
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
            {data.avatarUrl && (
                <div className="absolute -right-18 top-5 transform -translate-y-1/2 flex flex-col items-center">
                    <img
                        src={data.avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-white shadow"
                    />
                    <div className="mt-1 text-xs text-gray-700 w-max whitespace-nowrap">
                        {roles[data.label1] || "Team Member"}
                    </div>
                </div>
            )}
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
        <div className="w-[70%] mx-auto h-[450px] flex flex-col items-center bg-gray-50 relative overflow-hidden rounded-2xl">
            {/* Floating Buttons */}
            <div className="mb-2 flex gap-3 z-20 absolute bg-white left-[0px] bottom-[0] p-6 ">
                <button
                    onClick={handleNextStep}
                    className="bg-blue-500 text-white px-2 py-1.5 rounded-xl hover:bg-blue-600 transition disabled:opacity-50 text-[12px] font-medium shadow-sm"
                    disabled={currentIndex > nodes.length}
                >
                    Next Step
                </button>
                <button
                    onClick={handleRestart}
                    className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-xl hover:bg-gray-300 transition text-[12px] font-medium shadow-sm"
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
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
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

export default memo(FlowChart);
