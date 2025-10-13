//
//  UIApplicationExtensions.swift
//  Loop
//
//  Created by Kohji Onaja on 9/09/25.
//

import UIKit

extension UIApplication {
    func getRootViewController() -> UIViewController? {
        guard let scene = connectedScenes.first as? UIWindowScene, let rootViewController = scene.windows.first?.rootViewController else { return nil }
        
        return getVisibleViewController(from: rootViewController)
    }
    
    private func getVisibleViewController(from vc: UIViewController) -> UIViewController {
        if let nav = vc as? UINavigationController {
            return getVisibleViewController(from: nav.visibleViewController!)
        }
        if let tab = vc as? UITabBarController {
            return getVisibleViewController(from: tab.selectedViewController!)
        }
        if let presented = vc.presentedViewController {
            return getVisibleViewController(from: presented)
        }
        return vc
    }
}
