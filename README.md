# 🚀 Wasapi n8n Node Package no Oficial

[![npm version](https://badge.fury.io/js/n8n-nodes-wasapi.svg)](https://badge.fury.io/js/n8n-nodes-wasapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n Community](https://img.shields.io/badge/n8n-Community%20Node-brightgreen)](https://n8n.io)

> **The most comprehensive Wasapi integration for n8n** - Connect your WhatsApp Business API workflows with powerful automation capabilities.

## 📊 Operations Comparison: Make vs Our Implementation

Below is a detailed comparison of all operations available in Make's Wasapi integration versus our current implementation:

| **Category** | **Make Operation** | **Our Implementation** | **Status** |
|--------------|-------------------|-------------------------|------------|
| **Contacts & Custom Fields** | | | |
| | Get a Contact | ✅ Get Contact | ✅ **IMPLEMENTED** |
| | Delete a Contact | ✅ Delete Contact | ✅ **IMPLEMENTED** |
| | Create a Contact | ✅ Create Contact | ✅ **IMPLEMENTED** |
| | Get Labels | ✅ Get Labels | ✅ **IMPLEMENTED** |
| | Update a Contact | ✅ Update Contact | ✅ **IMPLEMENTED** |
| | Add Labels to Contact | ❌ **MISSING** | ❌ **NEEDS IMPLEMENTATION** |
| | Remove Labels from Contact | ❌ **MISSING** | ❌ **NEEDS IMPLEMENTATION** |
| | Chatbot: Change bot status for a Contact | ✅ Toggle Bot | ✅ **IMPLEMENTED** |
| | Get Custom Fields | ✅ Get Custom Fields | ✅ **IMPLEMENTED** |
| | Create Custom Field | ✅ Create Custom Field | ✅ **IMPLEMENTED** |
| | Delete Custom Field | ✅ Delete Custom Field | ✅ **IMPLEMENTED** |
| | Update Custom Field | ✅ Update Custom Field | ✅ **IMPLEMENTED** |
| **Messaging** | | | |
| | Send WhatsApp Message | ✅ Send Message | ✅ **IMPLEMENTED** |
| | Send Image Message | ✅ Send Attachment (covers this) | ⚠️ **PARTIALLY IMPLEMENTED** |
| | Send Video Message | ✅ Send Attachment (covers this) | ⚠️ **PARTIALLY IMPLEMENTED** |
| | Send Audio Message | ✅ Send Attachment (covers this) | ⚠️ **PARTIALLY IMPLEMENTED** |
| | Send Document Message | ✅ Send Attachment (covers this) | ⚠️ **PARTIALLY IMPLEMENTED** |
| | Send WhatsApp Template | ❌ **MISSING** | ❌ **NEEDS IMPLEMENTATION** |
| | Send WhatsApp Flow | ✅ Send Flow| ✅  **IMPLEMENTED** |
| **Agents** | | | |
| | Assign Agent to Contact | ❌ **MISSING** | ❌ **NEEDS IMPLEMENTATION** |
| | Get Agents | ❌ **MISSING** | ❌ **NEEDS IMPLEMENTATION** |
| | Change Chat Status or Transfer | ❌ **MISSING** | ❌ **NEEDS IMPLEMENTATION** |
| **Other** | | | |
| | Get User Information | ✅ Get User | ✅ **IMPLEMENTED** |

### 📈 Implementation Status Summary

**✅ IMPLEMENTED (15 operations):**
- Contact: Create, Get, Get Many, Update, Delete, Toggle Bot, Export
- Labels: Create, Get, Get Many, Get By ID, Update, Delete
- Custom Fields: Create, Get, Update, Delete
- WhatsApp: Send Message, Send Attachment
- Campaigns: Get, Get By ID

**❌ MISSING (9 operations):**
1. **Add Labels to Contact** - Attach new label(s) to existing contact
2. **Remove Labels from Contact** - Detach labels from a contact
3. **Send WhatsApp Template (w/ Phone Number)** - Choose a phone and send a message template
4. **Send WhatsApp Template** - Send a message template (initiate conversation)
5. **Send WhatsApp Flow** - Send a message with a button to open a WhatsApp flow
6. **Assign Agent to Contact** - Assign all chats from a contact to a specific Agent
7. **Get Agents** - Retrieve the list of non-blocked agents
8. **Change Chat Status or Transfer** - Change chat status or transfer chat to an agent
9. **Get User Information** - Obtain information of the current user

**⚠️ PARTIALLY IMPLEMENTED:**
- Our `Send Attachment` operation covers multiple media types (image, video, audio, document) but Make has them as separate operations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [n8n Documentation](https://docs.n8n.io/)
- **Issues**: [GitHub Issues](https://github.com/your-username/n8n-nodes-wasapi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/n8n-nodes-wasapi/discussions)
- **Wasapi Support**: [Wasapi Help Center](https://help.wasapi.com/)

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) team for the amazing automation platform
- [Wasapi](https://wasapi.com) for providing the WhatsApp Business API
- All contributors and community members

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

Made with ❤️ by the n8n community

[![n8n](https://img.shields.io/badge/n8n-Community%20Node-brightgreen)](https://n8n.io)
[![Wasapi](https://img.shields.io/badge/Wasapi-API%20Integration-blue)](https://wasapi.com)

</div>
