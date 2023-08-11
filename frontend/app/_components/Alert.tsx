"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Alert as AlertAntd } from "antd";

import { useAlertService } from "_services";

export { Alert };

function Alert() {
  const pathname = usePathname();
  const alertService = useAlertService();
  const alert = alertService.alert;

  useEffect(() => {
    // clear alert on location change
    alertService.clear();
  }, [pathname]);

  if (!alert) return null;

  return (
    <div className="container">
      <div className="m-3">
        <AlertAntd
          //   message="Warning"
          description={alert.message}
          type={alert.type === "success" ? "success" : "error"}
          showIcon
          closable
          onClose={alertService.clear}
        />
        {/* <div className={`alert alert-dismissible ${alert.type}`}>
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={alertService.clear}
          ></button>
        </div> */}
      </div>
    </div>
  );
}
