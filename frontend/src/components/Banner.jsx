import React from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  Phone,
  Star,
  Users,
  Ribbon,
  ShieldCheck,
} from "lucide-react";
import banner from "../assets/New_Banner.png";
import { useNavigate } from "react-router-dom";
import { bannerStyles } from "../assets/dummyStyles";
import { CreditCard } from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className={bannerStyles.bannerContainer}>
      {/* Main Banner Container with Animated Border */}
      <div className={bannerStyles.mainContainer}>
        {/* Auto-Animated Border Outline */}
        <div className={bannerStyles.borderOutline}>
          {/* Outer animated band (keeps your original class names to avoid style regressions) */}
          <div className={bannerStyles.outerAnimatedBand}></div>
          {/* Inner white border to separate content */}
          <div className={bannerStyles.innerWhiteBorder}></div>
        </div>

        {/* Content Container */}
        <div className={bannerStyles.contentContainer}>
          <div className={bannerStyles.flexContainer}>
            {/* Left Content Section */}
            <div className={bannerStyles.leftContent}>
              {/* Header with Badge */}
              <div className={bannerStyles.headerBadgeContainer}>
                <div className={bannerStyles.stethoscopeContainer}>
                  <div className={bannerStyles.stethoscopeInner}>
                    <Stethoscope className={bannerStyles.stethoscopeIcon} />
                  </div>
                </div>

                <div className={bannerStyles.titleContainer}>
                  {/* Responsive heading sizes: smaller on phones, same on desktop */}
                  <h1 className={bannerStyles.title}>
                    CuraDesk
                    <span className={bannerStyles.titleGradient}>Health</span>
                  </h1>

                  {/* Stars */}
                  <div className={bannerStyles.starsContainer}>
                    <div className={bannerStyles.starsInner}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={bannerStyles.starIcon} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <p className={bannerStyles.tagline}>
                All-in-One
                <span className={`block ${bannerStyles.taglineHighlight}`}>
                  Hospital Management System
                </span>
              </p>

              {/* Features Grid */}
              <div className={bannerStyles.featuresGrid}>
                <div className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderGreen} hover:scale-105 hover:shadow-lg transition-all duration-200`}>
                  <Users className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    Role-Based Dashboards
                  </span>
                </div>

                <div className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderBlue} hover:scale-105 hover:shadow-lg transition-all duration-200`}>
                  <ShieldCheck className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    Secure Auth (Clerk)
                  </span>
                </div>

                <div className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderEmerald} hover:scale-105 hover:shadow-lg transition-all duration-200`}>
                  <Calendar className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    Appointment Booking
                  </span>
                </div>

                <div className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderPurple} hover:scale-105 hover:shadow-lg transition-all duration-200`}>
                  <CreditCard className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    Stripe Payments
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={bannerStyles.ctaButtonsContainer}>
                <button
                  onClick={() => navigate("/doctors")}
                  aria-label="Book Appointment"
                  className={bannerStyles.bookButton}
                >
                  <div className={bannerStyles.bookButtonOverlay}></div>
                  <div className={bannerStyles.bookButtonContent}>
                    <Calendar className={bannerStyles.bookButtonIcon} />
                    <span>Book Appointment Now</span>
                  </div>
                </button>

                <button
                  onClick={() => (window.location.href = "tel:8299431275")}
                  aria-label="Emergency Call"
                  className={bannerStyles.emergencyButton}
                >
                  <div className={bannerStyles.emergencyButtonContent}>
                    <Phone className={bannerStyles.emergencyButtonIcon} />
                    <span>Emergency Call</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Image Section */}
            <div className={bannerStyles.rightImageSection}>
              {/* Main Image Container */}
              <div className={bannerStyles.imageContainer}>
                {/* Main Image Frame */}
                <div className={bannerStyles.imageFrame}>
                  {/* Controlled heights for small / medium / large screens so the image looks consistent */}
                  <img
                    src={banner}
                    alt="Professional Healthcare Team"
                    className={bannerStyles.image}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* end main container */}
    </div>
  )
}
export default Banner;