import * as React from "react"

export default function Header() {
    return (
        <container>
            <div className="container-upper-header flex justify-between">
                <div className="header-brand-text">
                    <h1 className="text-6xl text-fuchsia-400">
                        PET CARE HOSPITAL
                    </h1>
                </div>

                <div>

                </div>

                <div className="header-hotline-text">
                    <h4 className="text-xl ">
                        Hotline: 0912723231
                    </h4>
                </div>

                <div className="header-function">
                    <div className="function-login-signup">
                        <button>LOG IN</button>
                        <button>SIGN UP</button>
                    </div>

                    <div className="function-cart">
                        <button>Sản phẩm</button>
                    </div>
                </div>
            </div>
            <div className="container-navbar bg-fuchsia-300 ">
                <div className="navbar-left">
                    <div></div>
                </div>
                <div className="navbar-right">
                    <div></div>
                </div>
            </div>
        </container>
    );
}