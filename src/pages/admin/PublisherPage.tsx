import { useState, useEffect } from "react";
import CreatePublisherPopup from "../../components/CreatePublisherPopup";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import type { Publisher } from "../../types/Publisher";
import LoadingIndicator from "../../components/core/LoadingComponent";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Avatar from "../../components/core/Avatar";
function PublisherPage() {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatePublisher, setUpdatePublisher] = useState<Publisher | null>(
    null,
  );
  const fetchPublishers = async () => {
    try {
      const res = await axiosPrivate.get("/api/publishers/getAllPublishers");
      setPublishers(res.data);
      setLoading(false);
    } catch (err: any) {
      showToast("error", err.resposnse.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/api/publishers/deletePublisher/${id}`);
      showToast("success", "Uspješno obrisan izdavač");
      fetchPublishers();
      return;
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Greška pri brisanju");
    }
  };

  if (loading) {
    return (
      <>
        <LoadingIndicator placement="fullscreen" size="lg" />
      </>
    );
  }

  return (
    <div className="px-4 py-3">
      <div>
        <button
          className="py-3 px-5 rounded-lg bg-green-400 cursor-pointer font-semibold text-white text-sm md:text-lg max-md:w-full"
          onClick={() => setShowCreatePopup(true)}
        >
          Dodaj Izdavača
        </button>
      </div>

      {publishers && publishers.length > 0 ? (
        <>
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden mt-10">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Izdavač
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Država
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Kreirao
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                    Kreiran u
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody>
                {publishers.map((publisher: Publisher, idx) => {
                  return (
                    <tr
                      key={publisher._id}
                      className={`border-b border-slate-200 hover:bg-blue-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {publisher.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">
                        {publisher.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">
                        {publisher.createdBy ? (
                          <div className="flex items-center justify-center gap-3">
                            <Avatar
                              firstName={publisher.createdBy?.firstName || ""}
                              lastName={publisher.createdBy?.lastName || ""}
                              profilePicture={
                                publisher.createdBy?.profilePicture || ""
                              }
                              size="xs"
                            />
                            <span className="font-medium text-gray-900">
                              {publisher.createdBy?.firstName}{" "}
                              {publisher.createdBy?.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Nepoznat korisnik
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {format(
                          new Date(publisher.createdAt),
                          "dd-MM-yyyy hh:mm",
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-right">
                        <div className="flex gap-2 items-center justify-end">
                          <button
                            className="cursor-pointer"
                            onClick={() => {
                              setShowCreatePopup(true);
                              setUpdatePublisher(publisher);
                            }}
                          >
                            <FaEdit size={16} color="orange" />
                          </button>
                          <button
                            className="cursor-pointer"
                            onClick={() => handleDelete(publisher._id)}
                          >
                            <FaTrashAlt size={16} color="red" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden grid grid-cols-1 gap-4 mt-6">
            {publishers.map((publisher: Publisher) => {
              return (
                <div
                  key={publisher._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500 flex flex-col"
                >
                  {/* Header */}
                  <div className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">
                        {publisher.name}
                      </p>
                      <p className="text-sm text-blue-800 font-semibold mt-1">
                        {publisher.country}
                      </p>
                    </div>
                  </div>

                  {/* Creator info  */}
                  <div className="p-4 space-y-2 border-t border-b border-slate-200">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Kreirao
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {publisher.createdBy?.firstName}{" "}
                            {publisher.createdBy?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {publisher.createdBy?.email}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(publisher.createdAt),
                          "dd-MM-yyyy HH:mm",
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 p-4 mt-auto">
                    <button
                      className="text-sm flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      onClick={() => {
                        setShowCreatePopup(true);
                        setUpdatePublisher(publisher);
                      }}
                    >
                      <FaEdit size={16} />
                      Uredi
                    </button>
                    <button
                      className="text-sm flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      onClick={() => handleDelete(publisher._id)}
                    >
                      <FaTrashAlt size={16} />
                      Briši
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Nema dostupnih izdavača</p>
        </div>
      )}

      {showCreatePopup && (
        <CreatePublisherPopup
          onClose={() => {
            setShowCreatePopup(false);
            setUpdatePublisher(null);
          }}
          fetch={() => fetchPublishers()}
          {...(updatePublisher && {
            updateData: updatePublisher,
            update: true,
          })}
        />
      )}
    </div>
  );
}

export default PublisherPage;
