//
//  ReturnableSizeView.swift
//  NavigationRouting
//
//  Created by Kohji Onaja on 8/06/25.
//

import SwiftUI

struct ReturnableSizeView<Content: View>: View {
    
    @State private var size: CGSize = .zero
    let builder: (CGSize) -> Content

    init(@ViewBuilder content: @escaping (CGSize) -> Content) {
        self.builder = content
    }
    
    var body: some View {
        builder(size)
            .background {
                GeometryReader { geo in
                    Color.clear.onAppear {
                        self.size = geo.size
                    }
                }
            }
    }
}
