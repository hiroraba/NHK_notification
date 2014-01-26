require "rubygems"
require "crxmake"
require "pathname"

class CrxMaker
  CRX_NAME = "NHK_notification"

  def initialize
    @pkg = Pathname.new("pkg")
    @src = Pathname.new("src")
    @pem = Pathname.new("#{CRX_NAME}.pem")
    @out = Pathname.new("pkg/#{CRX_NAME}.crx")
  end

  def self.build
    new.build
  end

  def build
    remove_pkg_dir
    crx_make
  end

  def remove_pkg_dir
    @pkg.rmtree if @pkg.exist?
  end

  def crx_make
    @pkg.mkdir unless @pkg.exist?

    CrxMake.make(
      :ex_dir => @src,
      :crx_output => @out,
      :pkey => @pem,
      :verbose => true,
      :ignorefile => /\.swp$/,
      :ignoredir => /\.git$/,
    )
  end
end

task :crx do
  CrxMaker.build
end

task :default => :crx
