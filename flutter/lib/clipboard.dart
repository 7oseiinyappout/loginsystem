import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

class ClipboardPage extends StatefulWidget {
  const ClipboardPage({super.key});

  @override
  State<ClipboardPage> createState() => _ClipboardPageState();
}

class _ClipboardPageState extends State<ClipboardPage> {
  final List<Map<String, dynamic>> _clipboards = [];
  final ScrollController _scrollController = ScrollController();
  bool _loading = false;
  bool _hasMore = true;
  int _page = 0;
  final int _limit = 5;
  late IO.Socket _socket;

  @override
  void initState() {
    super.initState();
    _initializeSocket();
    _fetchClipboards();
    _scrollController.addListener(_onScroll);
  }

  void _initializeSocket() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    final decoded = jsonDecode(
        utf8.decode(base64.decode(base64.normalize(token.split('.')[1]))));
    final userId = decoded['_id'];

    _socket = IO.io(
        'http://192.168.1.12:4000',
        IO.OptionBuilder()
            .setQuery({'userId': userId}).setTransports(['websocket']).build());

    _socket.on('notification', (data) {
      setState(() {
        _clipboards.insert(0, data);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('📢 New clipboard received: ${data['content']}')),
      );
    });
  }

  Future<void> _fetchClipboards() async {
    if (_loading || !_hasMore) return;
    setState(() => _loading = true);

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    final response = await http.get(
      Uri.parse(
          'https://loginsystem-production-9118.up.railway.app/api/clipboard?skip=${_page * _limit}&limit=$_limit'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _clipboards.addAll(List<Map<String, dynamic>>.from(data['data']));
        _hasMore = (_page + 1) * _limit < data['total'];
        _page++;
      });
    }

    setState(() => _loading = false);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 100 &&
        !_loading &&
        _hasMore) {
      _fetchClipboards();
    }
  }

  Future<void> _addClipboard(String content, String type,
      [dynamic file]) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    final response = await http.post(
      Uri.parse(
          'https://loginsystem-production-9118.up.railway.app/api/clipboard'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
      body: jsonEncode({'content': content, 'type': type}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _clipboards.insert(0, data['data']);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Clipboard added successfully!')),
      );
    }
  }

  Future<void> _deleteClipboard(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    final response = await http.delete(
      Uri.parse(
          'https://loginsystem-production-9118.up.railway.app/api/clipboard'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json'
      },
      body: jsonEncode({'_id': id}),
    );

    if (response.statusCode == 200) {
      setState(() {
        _clipboards.removeWhere((clip) => clip['_id'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Clipboard deleted successfully!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clipboard'),
        backgroundColor: Colors.deepPurple,
      ),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          controller: _scrollController,
          itemCount: _clipboards.length + (_hasMore ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == _clipboards.length) {
              return const Center(child: CircularProgressIndicator());
            }

            final clip = _clipboards[index];
            final isImage = RegExp(r'\.(jpg|jpeg|png|gif|webp)\$')
                .hasMatch(clip['content'] ?? '');

            return Card(
              margin: const EdgeInsets.symmetric(vertical: 8.0),
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (clip['type'] == 'file' && isImage)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.network(
                          clip['content'],
                          fit: BoxFit.cover,
                          width: double.infinity,
                          height: 200,
                        ),
                      )
                    else if (clip['type'] == 'file')
                      Row(
                        children: [
                          const Icon(Icons.insert_drive_file,
                              color: Colors.blue),
                          const SizedBox(width: 8.0),
                          Expanded(
                            child: Text(
                              'File: ${clip['content']}',
                              style: const TextStyle(color: Colors.black87),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      )
                    else
                      Text(
                        clip['content'] ?? '',
                        style: const TextStyle(
                            fontSize: 16.0, color: Colors.black87),
                      ),
                    const SizedBox(height: 8.0),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Created: ${DateTime.parse(clip['createdAt']).toLocal()}'
                              .split('.')[0],
                          style: const TextStyle(
                              fontSize: 12.0, color: Colors.grey),
                        ),
                        Row(
                          children: [
                            if (clip['type'] == 'file')
                              IconButton(
                                icon: const Icon(Icons.download,
                                    color: Colors.green),
                                onPressed: () => _downloadFile(clip['content']),
                              )
                            else
                              IconButton(
                                icon:
                                    const Icon(Icons.copy, color: Colors.green),
                                onPressed: () =>
                                    _copyToClipboard(clip['content']),
                              ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _deleteClipboard(clip['_id']),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await _addClipboard('Sample Text', 'text');
        },
        backgroundColor: Colors.deepPurple,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _copyToClipboard(String? text) {
    if (text == null) return;
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Copied to clipboard!')),
    );
  }

  void _downloadFile(String? url) {
    if (url == null) return;
    // Open the file URL in the browser for download
    launchUrl(Uri.parse(url));
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _socket.dispose();
    super.dispose();
  }
}
