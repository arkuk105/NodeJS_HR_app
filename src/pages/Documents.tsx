import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import {
  FileText,
  Download,
  Upload,
  Eye,
  Folder,
  Calendar,
  User,
} from 'lucide-react';

interface Document {
  document_id: number;
  employee_id: number;
  employee_name: string;
  document_type: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  uploaded_by: string;
  description: string;
}

export const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const isAdmin = user?.role === 'hr_admin' || user?.role === 'manager';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const endpoint = isAdmin ? '/documents' : '/documents/my-documents';
      const data = await api.get<Document[]>(endpoint);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(
    (doc) => selectedType === 'all' || doc.document_type === selectedType
  );

  const documentTypes = [
    { value: 'all', label: 'All Documents', icon: FileText },
    { value: 'contract', label: 'Contracts', icon: FileText },
    { value: 'id', label: 'ID Documents', icon: FileText },
    { value: 'certificate', label: 'Certificates', icon: FileText },
    { value: 'performance', label: 'Performance', icon: FileText },
    { value: 'other', label: 'Other', icon: Folder },
  ];

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'contract':
        return 'bg-blue-100 text-blue-700';
      case 'id':
        return 'bg-green-100 text-green-700';
      case 'certificate':
        return 'bg-yellow-100 text-yellow-700';
      case 'performance':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading documents...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Document Management</h1>
          <p className="text-slate-600 mt-2">Manage employee documents and files</p>
        </div>
        {isAdmin && (
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload size={20} />
            Upload Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          const count = documents.filter(
            (d) => type.value === 'all' || d.document_type === type.value
          ).length;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`p-4 rounded-xl transition-all ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:shadow-md'
              }`}
            >
              <Icon size={24} className="mx-auto mb-2" />
              <p className="text-sm font-medium">{type.label}</p>
              <p className="text-xs mt-1 opacity-75">{count} files</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {documentTypes.find((t) => t.value === selectedType)?.label}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Document
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Employee
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Size
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Upload Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Uploaded By
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocuments.map((document) => (
                <tr key={document.document_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{document.file_name}</p>
                        {document.description && (
                          <p className="text-sm text-slate-500">{document.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{document.employee_name}</p>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getDocumentTypeColor(
                        document.document_type
                      )}`}
                    >
                      {document.document_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {formatFileSize(document.file_size)}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(document.upload_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{document.uploaded_by}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <Folder className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-500">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};
