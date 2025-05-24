import { useEffect, useState } from "react";
import request from "umi-request";
import config from "../../config";
import Animation from "../components/Animation";
import Title from "../components/Title";

export default function MessageBoardView() {
    const { MsgBoardUrl } = config;
    const [messages, setMessages] = useState<MessageCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [newMessage, setNewMessage] = useState({
        username: "",
        content: "",
        email: ""
    });

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await request(`${MsgBoardUrl}/api/messages`);
            if (res && res.code === 0) {
                setMessages(res.data);
            } else {
                setError(new Error("加载留言失败"));
            }
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const submitMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.username || !newMessage.content) return;

        try {
            const res = await request.post(`${MsgBoardUrl}/api/messages`, {
                data: newMessage
            });
            if (res && res.code === 0) {
                setMessages([res.data, ...messages]);
                setNewMessage({ username: "", content: "", email: "" });
            }
        } catch (err) {
            console.error("提交失败:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <Animation id="message-board">
        <form onSubmit={submitMessage} className="mb-8 space-y-4">
        <input
        type="text"
        placeholder="昵称"
        value={newMessage.username}
        onChange={(e) => setNewMessage({ ...newMessage, username: e.target.value })}
        className="w-full p-2 border rounded"
        required
        />
        <input
        type="email"
        placeholder="邮箱（可选）"
        value={newMessage.email}
        onChange={(e) => setNewMessage({ ...newMessage, email: e.target.value })}
        className="w-full p-2 border rounded"
        />
        <textarea
        placeholder="写点什么..."
        value={newMessage.content}
        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
        className="w-full p-2 border rounded"
        rows={3}
        required
        />
        <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
        发送
        </button>
        </form>

        <div className="space-y-6">
        {loading ? (
            <Skeletons />
        ) : error ? (
            <div className="text-red-500">{error.message}</div>
        ) : messages.length === 0 ? (
            <div>暂无留言</div>
        ) : (
            messages.map((msg, index) => <MessageCard key={index} {...msg} />)
        )}
        </div>
        </Animation>
    );
}

interface MessageCardProps {
    id: number;
    username: string;
    content: string;
    email?: string;
    created_at?: string;
}

function MessageCard(props: MessageCardProps) {
    const { CommentAvatar } = config;
    const avatarUrl = props.email?.endsWith("@qq.com")
    ? `https://q1.qlogo.cn/g?b=qq&nk=${props.email.split("@")[0]}&s=100`
    : CommentAvatar;

    return (
        <div className="flex items-start space-x-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
        <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full"/>
        <div>
        <h3 className="font-bold">{props.username}</h3>
        <p className="mt-1">{props.content}</p>
        <small className="text-gray-500 mt-2 block">
        {new Date(props.created_at || Date.now()).toLocaleString()}
        </small>
        </div>
        </div>
    );
}

function Skeletons() {
    return (
        <>
        {Array(3)
            .fill(1)
            .map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
            </>
    );
}
