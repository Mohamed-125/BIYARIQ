import React from "react";

const page = () => {
  return (
    <section className=" section info-page  ">
      <div className="container">
        <img
          src="/images/banner-gradient.png"
          alt=""
          className="bg--gradient white-version"
        />

        <img src="/images/element-moon1.png" alt="" className="element one" />
        <img src="/images/element-moon2.png" alt="" className="element two" />

        <h1 className="section-heading heading">الاسترجاع والاستبدال</h1>

        <p>
          جميع المنتجات الرقمية غير قابلة للاستبدال أو الاسترجاع حسب سياسة
          المتجر. في حال وجود خلل يرجي التواصل مع الدعم الفني.
        </p>
      </div>
    </section>
  );
};

export default page;
