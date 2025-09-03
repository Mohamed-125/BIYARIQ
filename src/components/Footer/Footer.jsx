import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#030728] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-right">
          {/* Store Info */}
          <div className="space-y-4 text-right">
            <Image
              src="/logo-white.svg"
              className="w-full max-w-60 mx-auto sm:max-w-40 sm:mx-0"
              width={140}
              height={140}
              alt="logo"
            />
            <p className="text-gray-400">
              متجر متخصص في بيع المنتجات الرقمية والبرامج والألعاب وبطاقات الشحن
            </p>
            <div className="flex gap-3  justify-start rtl:space-x-reverse">
              <Link
                href="#"
                className="m-0 hover:text-blue-500 transition-colors"
              >
                <FaFacebook className="h-8 w-8" />
              </Link>
              <Link
                href="#"
                className="m-0 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="h-8 w-8" />
              </Link>
              <Link
                href="#"
                className="m-0 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin className="h-8 w-8" />
              </Link>
              <Link
                href="#"
                className="m-0 hover:text-red-600 transition-colors"
              >
                <FaYoutube className="h-8 w-8" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-right">
            <h3 className="text-xl font-semibold">روابط مهمه</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الاسترجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الدعم الفني
                </Link>
              </li>
              <li>
                <Link
                  href="/loyalty-program"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  نظام الولاء
                </Link>
              </li>
              <li>
                <Link
                  href="/become-affiliate"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  التسويق بالعمولة
                </Link>
              </li>
              <li>
                <Link
                  href="/sell-with-us"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  بع معنا{" "}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-right">
            <h3 className="text-xl font-semibold">معلومات التواصل</h3>
            <ul className="space-y-2 text-gray-400">
              <li>support@magicstore.com</li>
              <li>+966 50 000 0000</li>
              <li>المملكة العربية السعودية</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 text-right">
            <h3 className="text-xl font-semibold">وسائل الدفع</h3>
            <div class="flex flex-wrap gap-2  justify-start   sm:mx-0">
              <Image
                src="/payment/mada.webp"
                alt="Mada"
                width={70}
                height={30}
                className="bg-white rounded  p-2"
              />
              <Image
                src="/payment/visa.webp"
                alt="Visa"
                width={70}
                height={30}
                className="bg-white rounded  p-2"
              />
              <Image
                src="/payment/mastercard.png"
                alt="Mastercard"
                width={70}
                height={30}
                className="bg-white rounded  p-2"
              />
              <Image
                src="/payment/apple_pay.webp"
                alt="Apple Pay"
                width={70}
                height={30}
                className="bg-white rounded  p-2"
              />
              <Image
                src="/payment/google_pay.webp"
                alt="Google Pay"
                width={70}
                height={30}
                className="bg-white rounded  p-2"
              />
              <Image
                src="/payment/stc_pay.webp"
                alt="STC Pay"
                width={70}
                height={30}
                className="bg-white rounded  p-2"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Magic Store. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
