import { useState, useEffect } from "react";
import CreatePublisherPopup from "../../components/CreatePublisherPopup";
import { axiosPrivate } from "../../api/axiosInstance";
import { showToast } from "../../utils/toast";
import type { Publisher } from "../../types/Publisher";
import LoadingIndicator from "../../components/core/LoadingComponent";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
function PublisherPage() {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [publishers, setPublishers] = useState<Publisher[] | null>(null);
  const [loading, setLoading] = useState(true);

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
      const response = await axiosPrivate.delete(
        `/api/publishers/deletePublisher/${id}`,
      );
      if (response.status === 200) {
        showToast("success", "Uspješno obrisan izdavač");
        fetchPublishers();
        return;
      } else {
        return showToast("error", "Greška pri brisanju");
      }
    } catch (err) {
      showToast("error", "Greška pri brisanju");
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
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                            {publisher.createdBy.firstName[0]}
                            {publisher.createdBy.lastName[0]}
                          </div>
                          <span className="font-medium text-gray-900">
                            {publisher.createdBy.firstName}{" "}
                            {publisher.createdBy.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {format(
                          new Date(publisher.createdAt),
                          "dd-MM-yyyy hh:mm",
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-right">
                        <div className="flex gap-2 items-center justify-end">
                          <button className="cursor-pointer">
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
                  className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500"
                >
                  <div className="p-5">
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <p className="font-bold text-gray-900 text-2xl mb-2">
                        {publisher.name}
                      </p>
                      <p className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {publisher.country}
                      </p>
                    </div>

                    <div className="space-y-3 bg-slate-50 rounded-lg p-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          Kreirao
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xs">
                            {publisher.createdBy.firstName[0]}
                            {publisher.createdBy.lastName[0]}
                          </div>
                          <p className="text-sm text-gray-900 font-medium">
                            {publisher.createdBy.firstName}{" "}
                            {publisher.createdBy.lastName}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          Datum kreiranja
                        </p>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {format(
                            new Date(publisher.createdAt),
                            "dd-MM-yyyy HH:mm",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center">
                        <FaEdit size={16} className="mr-2" />
                        Uredi
                      </button>
                      <button
                        className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center"
                        onClick={() => handleDelete(publisher._id)}
                      >
                        <FaTrashAlt size={16} className="mr-2" />
                        Briši
                      </button>
                    </div>
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
          onClose={() => setShowCreatePopup(false)}
          fetch={() => fetchPublishers()}
        />
      )}
    </div>
  );
}

export default PublisherPage;
