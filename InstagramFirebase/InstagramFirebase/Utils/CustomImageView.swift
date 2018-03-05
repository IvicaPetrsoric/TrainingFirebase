//
//  CustomImageView.swift
//  InstagramFirebase
//
//  Created by Ivica Petrsoric on 01/02/2018.
//  Copyright © 2018 Ivica Petrsoric. All rights reserved.
//

import UIKit

var imageCache = [String: UIImage]() // NSCache<NSString, UIImage>()

class CustomImageView: UIImageView{
    
    var lastURLUsedToLoadImage: String?
    
    func loadImage(urlString: String){
        
        lastURLUsedToLoadImage = urlString
        self.image = nil
        
        if let cachedImage = imageCache[urlString] {
            self.image = cachedImage
            return
        }
        
        guard let url = URL(string: urlString) else { return }
        
        URLSession.shared.dataTask(with: url) { (data, response, err) in
            
            if let err = err{
                print("Failed to fetch post image:",err)
                return
            }
            
            // fix flickering, async fetching ...
            if url.absoluteString != self.lastURLUsedToLoadImage{
                return
            }
            
            guard let imageData = data else { return }
            
            let photoimage = UIImage(data: imageData)
            
            imageCache[url.absoluteString] = photoimage
            
            DispatchQueue.main.async {
                self.image = photoimage
            }
            }.resume()
    }
    
}
