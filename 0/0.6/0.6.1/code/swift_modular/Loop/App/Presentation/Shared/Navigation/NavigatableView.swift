//
//  NavigatableView.swift
//  NavigationRouting
//
//  Created by Kohji Onaja on 8/06/25.
//

import SwiftUI

struct NavigatableView<Content: View>: View {
    @StateObject private var router = RouterViewModel()
    let content: (Router?) -> Content
    @State private var previousPath: [NavigationDestination] = []
    @State private var currentDismissAction: (() -> Void)?
    
    var body: some View {
        NavigationStack(path: $router.path) {
            content(router)
                .navigationDestination(for: NavigationDestination.self) { dest in
                    router.view(for: dest)
                }
                .sheet(item: $router.sheet) { dest in
                    router.view(for: dest)
                        .sheetBehavior(router.sheetBehavior)
                        .onAppear {
                            currentDismissAction = dest.onDismiss
                        }
                        .background(.ultraThinMaterial)
                }
                .fullScreenCover(item: $router.fullScreen, onDismiss: {
                    router.fullScreen?.onDismiss?()
                    router.fullScreen = nil
                }) { dest in
                    router.view(for: dest)
                }
        }
        .environment(\.router, router)
        .onAppear {
            previousPath = router.path
        }
        .onChange(of: router.path) { _, newPath in
            let oldPath = previousPath
            if newPath.count < oldPath.count {
                if let popped = oldPath.first(where: { !newPath.contains($0) }) {
                    popped.onDismiss?()
                }
            }
            previousPath = newPath
        }.onChange(of: router.sheet) { _, newSheet in
            if newSheet == nil {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1, execute: {
                    currentDismissAction?()
                    currentDismissAction = nil
                })
            }
          }
    }
}



