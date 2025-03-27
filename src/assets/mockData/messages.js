const messages =
    [
      {
        '_id': '660123abcde1234567890001',
        'senderId': '660111abcde1234567890001',
        'receiverId': '660112abcde1234567890002',
        'conversationId': '660200abcde1234567890001',
        'message': 'Hey, bạn khỏe không?',
        'messageType': 'text',
        'attachments': [],
        'read': false,
        'createdAt': '2024-03-27T10:00:00Z',
        'updatedAt': '2024-03-27T10:00:00Z',
        '_destroy': false
      },
      {
        '_id': '660123abcde1234567890002',
        'senderId': '660112abcde1234567890002',
        'receiverId': '660111abcde1234567890001',
        'conversationId': '660200abcde1234567890001',
        'message': 'Mình khỏe, còn bạn?',
        'messageType': 'text',
        'attachments': [],
        'read': true,
        'createdAt': '2024-03-27T10:02:00Z',
        'updatedAt': '2024-03-27T10:02:00Z',
        '_destroy': false
      },
      {
        '_id': '660123abcde1234567890003',
        'senderId': '660111abcde1234567890001',
        'receiverId': '660112abcde1234567890002',
        'conversationId': '660200abcde1234567890001',
        'message': 'Đây là hình ảnh chuyến đi du lịch của mình!',
        'messageType': 'image',
        'attachments': ['https://i.pravatar.cc/150?u=P002'],
        'read': false,
        'createdAt': '2024-03-27T10:05:00Z',
        'updatedAt': '2024-03-27T10:05:00Z',
        '_destroy': false
      },
      {
        '_id': '660123abcde1234567890004',
        'senderId': '660112abcde1234567890002',
        'receiverId': '660111abcde1234567890001',
        'conversationId': '660200abcde1234567890001',
        'message': 'File tài liệu bạn cần đây nhé!',
        'messageType': 'files',
        'attachments': ['https://i.pravatar.cc/150?u=P002'],
        'read': true,
        'createdAt': '2024-03-27T10:10:00Z',
        'updatedAt': '2024-03-27T10:10:00Z',
        '_destroy': false
      }
    ]
export default messages