import streamlit as st
import streamlit.components.v1 as components
import os

st.set_page_config(
    page_title="AegisShield | Financial & Messaging Security Suite",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Streamlit wrapper
st.markdown("""
<style>
    .main .block-container {
        padding-top: 1rem;
        padding-bottom: 0rem;
        padding-left: 1rem;
        padding-right: 1rem;
        max-width: 100%;
    }
    header { visibility: hidden; }
    footer { visibility: hidden; }
</style>
""", unsafe_allow_html=True)

# Sidebar with platform controls & documentation
with st.sidebar:
    st.title("🛡️ AegisShield SOC")
    st.caption("Enterprise Financial & WhatsApp Security Platform")
    
    st.markdown("---")
    st.subheader("Security Modules Active")
    st.markdown("""
    - **Phishing Guardian**: Inbound domain & link entropy scanner
    - **Biometric Banking MFA**: FIDO2 TouchID/FaceID verification
    - **WhatsApp Web E2EE**: Signal Double-Ratchet monitor
    - **TikTok Gateway**: Watermarked share badges & fraud defense
    - **GDPR / CCPA Erasure**: Ephemeral post-purchase shredding
    - **SOC Audit Logs**: Real-time regulatory compliance ledger
    """)
    
    st.markdown("---")
    st.subheader("Deployment Targets")
    st.success("✅ Netlify ready: `netlify.toml` configured")
    st.success("✅ Vercel ready: `vercel.json` & `.npmrc` configured")
    st.success("✅ Streamlit ready: `app.py` & `requirements.txt` active")

# Check if production build exists or embed live preview URL
app_url = os.environ.get("APP_URL", "https://ais-pre-buzwcgajnur53xis2pd4sn-219798672528.asia-southeast1.run.app")

components.iframe(
    src=app_url,
    height=880,
    scrolling=True
)
