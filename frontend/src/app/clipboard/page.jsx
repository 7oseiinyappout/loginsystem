'use client'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import ClipboardJS from 'clipboard'

export default function ClipboardPage() {
    const [showForm, setShowForm] = useState(false)
    const [content, setContent] = useState('')
    const [clipboards, setClipboards] = useState([])

    useEffect(() => {
        fetchClipboards()
    }, [])

    const fetchClipboards = async () => {
        const token = localStorage.getItem('token')
        const res = await fetch('http://192.168.1.12:3000/api/clipboard', {
            headers: { Authorization: `Bearer ${token}` }
        })

        // التأكد من أن البيانات هي مصفوفة
        const data = await res.json()
        if (Array.isArray(data.data)) {
            setClipboards(data.data)
        } else {
            console.error('Data is not an array:', data)
        }
    }

    const handleAddClipboard = async () => {
        const token = localStorage.getItem('token')
        const res = await fetch('http://192.168.1.12:3000/api/clipboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content,
                type: 'text'
            }),
        })

        const data = await res.json()

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Clipboard Saved!',
                text: 'The clipboard has been added successfully.',
                confirmButtonColor: '#0070f3',
            })
            setContent('')
            setShowForm(false)
            fetchClipboards() // 🔄 تحديث القائمة بعد الإضافة
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.message || 'Something went wrong.',
                confirmButtonColor: '#d33',
            })
        }
    }

    const handleCopy = (text) => {
        const tempButton = document.createElement('button')
        tempButton.setAttribute('data-clipboard-text', text)
        document.body.appendChild(tempButton)

        const clipboard = new ClipboardJS(tempButton)
        clipboard.on('success', () => {
            Swal.fire({
                icon: 'success',
                title: 'Copied to Clipboard!',
                text: 'The content has been copied successfully.',
                confirmButtonColor: '#28a745',
            })
            clipboard.destroy()
            document.body.removeChild(tempButton)
        })

        clipboard.on('error', () => {
            Swal.fire({
                icon: 'info',
                title: 'Copy Manually',
                html: `<p>Unable to copy automatically. Please copy the text below:</p><textarea style="width: 100%; height: 80px;">${text}</textarea>`,
                confirmButtonColor: '#0070f3',
            })
            clipboard.destroy()
            document.body.removeChild(tempButton)
        })

        tempButton.click()
    }

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch('http://192.168.1.12:3000/api/clipboard', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ _id: id }),
        })

        const data = await res.json()

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Clipboard Deleted!',
                text: 'The clipboard has been deleted successfully.',
                confirmButtonColor: '#d33',
            })
            fetchClipboards()
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.message || 'Something went wrong.',
                confirmButtonColor: '#d33',
            })
        }
    }


    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Clipboard</h2>

            {showForm ? (
                <div style={styles.form}>
                    <textarea
                        style={styles.textarea}
                        placeholder="Write your clipboard content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={styles.saveButton} onClick={handleAddClipboard}>
                            Save
                        </button>
                        <button style={styles.cancelButton} onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button style={styles.addButton} onClick={() => setShowForm(true)}>
                    + Add Clipboard
                </button>
            )}

            {/* ✅ عرض الكليبات */}
            <div style={styles.clipList}>
                {clipboards.length === 0 ? (
                    <p style={{ marginTop: '20px' }}>No clipboards found.</p>
                ) : (
                    clipboards.map((clip, i) => (
                        <div key={i} style={styles.card}>
                            <p>{clip.content}</p>
                            <small style={{ color: '#555' }}>{new Date(clip.createdAt).toLocaleString()}</small>
                            <div style={styles.buttons}>
                                <button style={styles.copyButton} onClick={() => handleCopy(clip.content)}>
                                    Copy
                                </button>
                                <button style={styles.deleteButton} onClick={() => handleDelete(clip._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '26px',
        marginBottom: '20px',
    },
    addButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '400px',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        height: '120px',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '6px',
    },
    saveButton: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    cancelButton: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    clipList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '400px',
    },
    card: {
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
        border: '1px solid #ddd',
        wordBreak: 'break-word',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
    },
    copyButton: {
        padding: '6px 12px',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '6px 12px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
}
