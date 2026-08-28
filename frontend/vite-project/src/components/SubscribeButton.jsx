
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Spinner from "./Spinner";


function SubscribeButton({ channelId, initialSubscribers = 0 }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [subscribed, setSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /*
   * Check subscription status
   */
  useEffect(() => {
    const checkSubscription = async () => {
      if (!channelId) {
        return;
      }

      // If user is not logged in,
      // no need to call protected API
      if (!user) {
        setSubscribed(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await API.get(`/subscriptions/check/${channelId}`);


        setSubscribed(response.data.data.subscribed);
      } catch (error) {
        console.error("Check subscription status error:", error);

        setSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [channelId, user]);

  /*
   * Subscribe / Unsubscribe
   */
  const handleSubscribe = async () => {
    // User must be logged in
    if (!user) {
      navigate("/login");
      return;
    }

    if (!channelId || actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      if (subscribed) {
        /*
         * UNSUBSCRIBE
         */
        const response = await API.delete(`/subscriptions/${channelId}`);

        if (response.data.success) {
          setSubscribed(false);

          setSubscribers((prev) => Math.max(prev - 1, 0));

          /*
           * Tell Sidebar/Subscriptions component
           * that subscription list has changed.
           */
          window.dispatchEvent(new Event("subscriptionChanged"));
        }
      } else {
        /*
         * SUBSCRIBE
         */
        const response = await API.post(`/subscriptions/${channelId}`);


        if (response.data.success) {
          setSubscribed(true);

          setSubscribers((prev) => prev + 1);

          /*
           * Tell Sidebar/Subscriptions component
           * that subscription list has changed.
           */
          window.dispatchEvent(new Event("subscriptionChanged"));
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * Loading
   */
if (loading) {
  return (
    <button
      type="button"
      disabled
      className="
        flex
        items-center
        gap-2
        rounded-full
        bg-gray-200
        px-5
        py-2
        text-sm
        font-medium
        text-gray-500
        dark:bg-gray-800
        dark:text-gray-400
      "
    >
      {/* Show spinner while checking subscription status */}
      <Spinner />
      Checking...
    </button>
  );
}

  /*
   * Button
   */
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={actionLoading}
        className={`
          rounded-full
          px-5
          py-2
          text-sm
          font-medium
          transition

          disabled:cursor-not-allowed
          disabled:opacity-60

          ${
            subscribed
              ? `
                bg-gray-200
                text-gray-900
                hover:bg-gray-300
                dark:bg-gray-800
                dark:text-white
                dark:hover:bg-gray-700
              `
              : `
                bg-black
                text-white
                hover:bg-gray-800
                dark:bg-white
                dark:text-black
                dark:hover:bg-gray-200
              `
          }
        `}
      >
        {actionLoading ? <Spinner/> : subscribed ? "Subscribed" : "Subscribe"}
      </button>


    </div>
  );
}

export default SubscribeButton;