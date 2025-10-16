 -- Allow anyone to upload files into the `images` bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

-- Allow anyone to view files in the `images` bucket
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow anyone to delete files from the `images` bucket
CREATE POLICY "Allow public delete" ON storage.objects
FOR DELETE USING (bucket_id = 'images');
