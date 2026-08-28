import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/api";

function Subscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH SUBSCRIPTIONS
  // =========================

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const response = await API.get("/subscriptions/my");

      setSubscriptions(response.data.data || []);
    } catch (error) {
      console.error("Fetch subscriptions error:", error);

      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // =========================
  // LISTEN FOR SUBSCRIPTION
  // CHANGES
  // =========================

  useEffect(() => {
    const handleSubscriptionChanged = () => {
      fetchSubscriptions();
    };

    window.addEventListener("subscriptionChanged", handleSubscriptionChanged);

    return () => {
      window.removeEventListener(
        "subscriptionChanged",
        handleSubscriptionChanged,
      );
    };
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="px-3 py-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // =========================
  // NO SUBSCRIPTIONS
  // =========================

  if (subscriptions.length === 0) {
    return null;
  }

  // =========================
  // SUBSCRIPTIONS
  // =========================

  return (
    <div className="mt-1 space-y-1">
      {subscriptions.map((subscription) => {
        const channel = subscription.channel;

        if (!channel) {
          return null;
        }

        return (
          <button
            key={subscription._id}
            type="button"
            onClick={() => navigate(`/channel/${channel._id}`)}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-2
              text-left
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
          >
            {/* CHANNEL PROFILE */}
            {channel.profilePic ? (
              <img
                src={channel.profilePic}
                alt={channel.name}
                className="
                  h-7
                  w-7
                  shrink-0
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-300
                  text-xs
                  font-semibold
                  text-gray-700
                  dark:bg-gray-700
                  dark:text-white
                "
              >
                {channel.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* CHANNEL NAME */}
            <span
              className="
                truncate
                text-sm
                font-medium
                text-gray-800
                dark:text-gray-200
              "
            >
              {channel.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Subscriptions;
