const Footer = () => {
  return (
    <footer className="bg-gray-900 p-4">
      <div className="flex justify-around  text-white mb-4">
        {/*Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Make reservation</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/*Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Follow us on social media
          </h3>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
          </ul>
        </div>
        {/*Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <ul>
            <li>Address: Telakkakatu 5, Lahti</li>
            <li>Phone: 040 042 1453</li>
            <li>Email: vilkasprosnookervaraukset@gmail.com</li>
          </ul>
        </div>
      </div>
      {/*Created By */}
      <p className="text-center text-gray-400 text-sm">
        &copy; Created by Oskari Suonpää 2025 | All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
